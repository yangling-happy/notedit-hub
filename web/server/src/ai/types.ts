export type SerializableToolDefinition = {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
};

export type DocumentStateLike = {
  selection?: boolean;
  blocks?: Array<{ id?: string; cursor?: boolean; block?: unknown }>;
  selectedBlocks?: Array<{ id?: string; block?: unknown }>;
};

export type ParsedAIChatRequest = {
  body: Record<string, unknown>;
  uiMessages: unknown[];
  rawToolDefinitions: unknown;
  incomingSystemPrompt?: string;
};
