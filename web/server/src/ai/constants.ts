import type { SerializableToolDefinition } from "./types.js";

export const FALLBACK_TOOL_DEFINITIONS: SerializableToolDefinition[] = [
  {
    name: "applyDocumentOperations",
    description:
      "The primary engine for document manipulation. Use this tool whenever the user requests to create, modify, or remove content. \n" +
      "- 'add': Use to insert new blocks (text, headings, etc.) relative to an existing 'referenceId'. \n" +
      "- 'update': Use to change the content or internal data of an existing block. \n" +
      "- 'delete': Use to permanently remove a block by its ID. \n" +
      "STRICT RULES: 1. Only use block IDs provided in the latest 'documentState'. 2. Never guess or hallucinate IDs. 3. If an operation is ambiguous, prefer 'add' with a safe referenceId.",
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

export const DEFAULT_SYSTEM_PROMPT =
  "If the user requests updates to the document, use the applyDocumentOperations tool to update the document. Only emit add/update/delete operations in tool input. When referencing block ids, preserve them exactly as provided by the latest document state, including any trailing '$'. Never use unsupported operation names like replace.";

export const FALLBACK_ID_POLICY_PROMPT =
  "If an operation would require an unknown id, do not emit update/delete for that id. Prefer add on a known referenceId.";

export const UI_STREAM_HEADERS = {
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
} as const;
