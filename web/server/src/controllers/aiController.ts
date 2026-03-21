import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, jsonSchema, streamText, tool } from "ai";
import type { Request, Response } from "express";

type SerializableToolDefinition = {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
};

type DocumentStateLike = {
  selection?: boolean;
  blocks?: Array<{ id?: string; cursor?: boolean; block?: unknown }>;
  selectedBlocks?: Array<{ id?: string; block?: unknown }>;
};

const FALLBACK_TOOL_DEFINITIONS = [
  {
    name: "applyDocumentOperations",
    description:
      "Apply document operations to update the editor content. Use for add/update/delete style edits.",
    inputSchema: {
      type: "object",
      properties: {
        operations: {
          type: "array",
          items: {
            anyOf: [
              {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["add"] },
                  referenceId: { type: "string" },
                  position: {
                    type: "string",
                    enum: ["before", "after", "nested"],
                  },
                  blocks: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 1,
                  },
                },
                required: ["type", "referenceId", "position", "blocks"],
                additionalProperties: false,
              },
              {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["update"] },
                  id: { type: "string" },
                  block: { type: "string" },
                },
                required: ["type", "id", "block"],
                additionalProperties: false,
              },
              {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["delete"] },
                  id: { type: "string" },
                },
                required: ["type", "id"],
                additionalProperties: false,
              },
            ],
          },
        },
      },
      required: ["operations"],
      additionalProperties: false,
    },
  },
];

const DEFAULT_SYSTEM_PROMPT =
  "If the user requests updates to the document, use the applyDocumentOperations tool to update the document. Only emit add/update/delete operations in tool input. When referencing block ids, preserve them exactly as provided by the latest document state, including any trailing '$'. Never use unsupported operation names like replace.";

const getLatestDocumentState = (
  uiMessages: any[],
): DocumentStateLike | null => {
  for (let i = uiMessages.length - 1; i >= 0; i--) {
    const candidate = uiMessages[i]?.metadata?.documentState;
    if (candidate && typeof candidate === "object") {
      return candidate as DocumentStateLike;
    }
  }
  return null;
};

const extractKnownBlockIds = (documentState: DocumentStateLike | null) => {
  if (!documentState) return [] as string[];

  const source = documentState.selection
    ? Array.isArray(documentState.selectedBlocks)
      ? documentState.selectedBlocks
      : []
    : Array.isArray(documentState.blocks)
      ? documentState.blocks
      : [];

  const ids = source
    .map((item: any) => item?.id)
    .filter((id: unknown): id is string => typeof id === "string");

  return Array.from(new Set(ids));
};

const buildIdGuardPrompt = (knownIds: string[]) => {
  if (knownIds.length === 0) {
    return "Only reference ids that appear in the latest documentState. If no valid id is available for update/delete, prefer a single add operation using an existing referenceId from documentState.";
  }

  const cappedIds = knownIds.slice(0, 150);
  const idsText = cappedIds.join(", ");
  const truncatedNote =
    knownIds.length > cappedIds.length
      ? ` (truncated ${knownIds.length - cappedIds.length} more ids)`
      : "";

  return `STRICT ID GUARD: For update/delete.id and add.referenceId, you MUST use one exact id from this allowed set (including trailing '$' when present): [${idsText}]${truncatedNote}. Never invent new ids.`;
};

const normalizeToolDefinitions = (
  raw: unknown,
): SerializableToolDefinition[] => {
  if (Array.isArray(raw)) {
    return raw
      .filter((item): item is SerializableToolDefinition => {
        return (
          !!item &&
          typeof item === "object" &&
          typeof (item as any).name === "string"
        );
      })
      .map((item) => {
        const normalized: SerializableToolDefinition = {
          name: item.name,
          ...(typeof item.description === "string"
            ? { description: item.description }
            : {}),
          ...(item.inputSchema && typeof item.inputSchema === "object"
            ? { inputSchema: item.inputSchema as Record<string, unknown> }
            : {}),
        };
        return normalized;
      });
  }

  if (!!raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, any>)
      .filter(([, def]) => !!def && typeof def === "object")
      .map(([name, def]) => {
        const normalized: SerializableToolDefinition = {
          name,
          ...(typeof def.description === "string"
            ? { description: def.description }
            : {}),
          ...(def.inputSchema && typeof def.inputSchema === "object"
            ? { inputSchema: def.inputSchema as Record<string, unknown> }
            : {}),
        };
        return normalized;
      });
  }

  return [];
};

const aliyun = createOpenAI({
  apiKey: process.env.ALIBABA_CLOUD_API_KEY!,
  baseURL: process.env.ALIBABA_CLOUD_BASE_URL!,
});

export const handleAIChat = async (req: Request, res: Response) => {
  // 0. 关键：防止 Node.js 默认的 2 分钟超时断开连接
  req.socket.setTimeout(0);

  try {
    const body = (req.body ?? {}) as any;
    const uiMessages = Array.isArray(body.messages)
      ? body.messages
      : Array.isArray(body?.body?.messages)
        ? body.body.messages
        : [];
    const rawToolDefinitions =
      body.toolDefinitions ?? body?.body?.toolDefinitions;
    const toolDefinitions = normalizeToolDefinitions(rawToolDefinitions);
    const incomingSystemPrompt =
      (typeof body.systemPrompt === "string" && body.systemPrompt) ||
      (typeof body?.body?.systemPrompt === "string" &&
        body.body.systemPrompt) ||
      undefined;
    const latestDocumentState = getLatestDocumentState(uiMessages);
    const knownIds = extractKnownBlockIds(latestDocumentState);
    const modelMessages = await convertToModelMessages(uiMessages as any);

    const firstMessageHasDocumentState =
      !!uiMessages?.[0]?.metadata?.documentState;
    console.log(
      `🚀 收到请求: messages=${uiMessages.length}, toolDefinitions=${toolDefinitions.length}, hasDocumentState=${firstMessageHasDocumentState}`,
    );
    console.log(`🧩 body keys: ${Object.keys(body).join(", ") || "(empty)"}`);

    // BlockNote 会在请求体里附带 toolDefinitions，用于让模型输出可执行的文档操作。
    // 若忽略这部分，模型通常只会返回普通文本，前端无法把它应用到编辑器。
    const effectiveToolDefinitions =
      toolDefinitions.length > 0 ? toolDefinitions : FALLBACK_TOOL_DEFINITIONS;

    if (toolDefinitions.length === 0) {
      console.warn(
        "⚠️ 未收到 toolDefinitions，已回退到 fallback schema，结果可能不稳定",
      );
    }

    const tools = Array.isArray(effectiveToolDefinitions)
      ? Object.fromEntries(
          effectiveToolDefinitions
            .filter(
              (d: any) =>
                typeof d?.name === "string" &&
                d?.inputSchema &&
                typeof d?.inputSchema === "object",
            )
            .map((d: any) => [
              d.name,
              tool({
                description: d?.description,
                inputSchema: jsonSchema(d.inputSchema),
              }),
            ]),
        )
      : undefined;

    const finalSystemPrompt = [
      incomingSystemPrompt || DEFAULT_SYSTEM_PROMPT,
      buildIdGuardPrompt(knownIds),
      "If an operation would require an unknown id, do not emit update/delete for that id. Prefer add on a known referenceId.",
    ].join("\n\n");

    const result = streamText({
      model: aliyun(process.env.ALIBABA_CLOUD_MODEL_NAME || "qwen-plus"),
      system: finalSystemPrompt,
      messages: modelMessages,
      ...(tools && Object.keys(tools).length > 0 ? { tools } : {}),
      ...(tools && Object.keys(tools).length > 0
        ? { toolChoice: "required" as const, maxSteps: 1 }
        : {}),
      onStepFinish: ({ toolCalls }) => {
        if (toolCalls?.length) {
          console.log(
            `🛠️ step toolCalls: ${toolCalls.map((t) => t.toolName).join(", ")}`,
          );
        }
      },
    });

    // --- 2. 直接使用 AI SDK 官方 UI Message Stream 输出 ---
    // 这与前端 DefaultChatTransport 协议一致，避免手写流协议导致前端不渲染。
    result.pipeUIMessageStreamToResponse(res, {
      headers: {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
    console.log("✅ 已开始 UI Message Stream 传输");
    return;
  } catch (error: any) {
    console.error("❌ AI 路由崩溃:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "AI Service Error" });
    }
  }
};
