import type { Request, Response } from "express";
import { startChatStream } from "../ai/chatService.js";
import { parseAIChatRequest } from "../ai/chatRequest.js";
import {
  FALLBACK_TOOL_DEFINITIONS,
  UI_STREAM_HEADERS,
} from "../ai/constants.js";
import {
  extractKnownBlockIds,
  getLatestDocumentState,
} from "../ai/documentState.js";
import { buildFinalSystemPrompt } from "../ai/promptBuilder.js";
import { createAISDKTools, normalizeToolDefinitions } from "../ai/tools.js";

export const handleAIChat = async (req: Request, res: Response) => {
  // 0. 关键：防止 Node.js 默认的 2 分钟超时断开连接
  req.socket.setTimeout(0);

  try {
    const { body, uiMessages, rawToolDefinitions, incomingSystemPrompt } =
      parseAIChatRequest(req.body);
    const toolDefinitions = normalizeToolDefinitions(rawToolDefinitions);
    const latestDocumentState = getLatestDocumentState(uiMessages);
    const knownIds = extractKnownBlockIds(latestDocumentState);

    const firstMessageHasDocumentState = !!(uiMessages?.[0] as any)?.metadata
      ?.documentState;
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

    const tools = createAISDKTools(effectiveToolDefinitions);
    const finalSystemPrompt = buildFinalSystemPrompt(
      incomingSystemPrompt,
      knownIds,
    );

    const result = await startChatStream({
      uiMessages,
      systemPrompt: finalSystemPrompt,
      ...(tools ? { tools } : {}),
    });

    // --- 2. 直接使用 AI SDK 官方 UI Message Stream 输出 ---
    // 这与前端 DefaultChatTransport 协议一致，避免手写流协议导致前端不渲染。
    result.pipeUIMessageStreamToResponse(res, {
      headers: UI_STREAM_HEADERS,
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
