import type { ParsedAIChatRequest } from "./types.js";

export const parseAIChatRequest = (rawBody: unknown): ParsedAIChatRequest => {
  const body =
    rawBody && typeof rawBody === "object"
      ? (rawBody as Record<string, unknown>)
      : {};

  const nestedBody =
    body.body && typeof body.body === "object"
      ? (body.body as Record<string, unknown>)
      : undefined;

  const uiMessages = Array.isArray(body.messages)
    ? body.messages
    : Array.isArray(nestedBody?.messages)
      ? (nestedBody.messages as unknown[])
      : [];

  const bodyMetadata =
    body.metadata && typeof body.metadata === "object"
      ? (body.metadata as Record<string, unknown>)
      : undefined;
  const nestedMetadata =
    nestedBody?.metadata && typeof nestedBody.metadata === "object"
      ? (nestedBody.metadata as Record<string, unknown>)
      : undefined;

  const firstUserMessageWithMetadata = uiMessages.find(
    (m) => !!(m as any)?.metadata && typeof (m as any).metadata === "object",
  ) as any;

  const rawToolDefinitions =
    body.toolDefinitions ??
    nestedBody?.toolDefinitions ??
    bodyMetadata?.toolDefinitions ??
    nestedMetadata?.toolDefinitions ??
    firstUserMessageWithMetadata?.metadata?.toolDefinitions;

  const incomingSystemPrompt =
    (typeof body.systemPrompt === "string" && body.systemPrompt) ||
    (typeof nestedBody?.systemPrompt === "string" && nestedBody.systemPrompt) ||
    undefined;

  return {
    body,
    uiMessages,
    rawToolDefinitions,
    ...(incomingSystemPrompt ? { incomingSystemPrompt } : {}),
  };
};
