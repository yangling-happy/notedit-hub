import { convertToModelMessages, streamText } from "ai";
import type { Response } from "express";
import { aliyun, resolveModelName } from "./provider.js";

type StartChatStreamParams = {
  uiMessages: unknown[];
  systemPrompt: string;
  tools?: Record<string, unknown>;
};

export type ChatStreamResult = {
  pipeUIMessageStreamToResponse: (
    res: Response,
    options?: {
      headers?: Record<string, string>;
    },
  ) => void;
};

export const startChatStream = async ({
  uiMessages,
  systemPrompt,
  tools,
}: StartChatStreamParams): Promise<ChatStreamResult> => {
  const modelMessages = await convertToModelMessages(uiMessages as any);
  const hasTools = !!tools && Object.keys(tools).length > 0;
  const toolNames = hasTools
    ? Object.keys(tools as Record<string, unknown>)
    : [];

  console.log(
    `🤖 chat stream init: modelMessages=${modelMessages.length}, hasTools=${hasTools}, tools=${toolNames.join(",") || "(none)"}`,
  );

  return streamText({
    model: aliyun(resolveModelName()),
    system: systemPrompt,
    messages: modelMessages,
    ...(hasTools ? { tools: tools as any } : {}),
    ...(hasTools ? { toolChoice: "auto" as const, maxSteps: 1 } : {}),
    onStepFinish: ({ toolCalls, finishReason }) => {
      if (toolCalls?.length) {
        console.log(
          `🛠️ step toolCalls: ${toolCalls.map((t) => t.toolName).join(", ")}`,
        );
      } else if (hasTools) {
        console.warn(
          `⚠️ step finished without toolCalls (finishReason=${String(finishReason)}) while tools are enabled`,
        );
      }
    },
  }) as ChatStreamResult;
};
