import { jsonSchema, tool } from "ai";
import type { SerializableToolDefinition } from "./types.js";

export const normalizeToolDefinitions = (
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
          ...(item.outputSchema && typeof item.outputSchema === "object"
            ? { outputSchema: item.outputSchema as Record<string, unknown> }
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
          ...(def.outputSchema && typeof def.outputSchema === "object"
            ? { outputSchema: def.outputSchema as Record<string, unknown> }
            : {}),
        };
        return normalized;
      });
  }

  return [];
};

export const createAISDKTools = (definitions: SerializableToolDefinition[]) => {
  const entries = definitions
    .filter(
      (d) =>
        typeof d?.name === "string" &&
        !!d?.inputSchema &&
        typeof d.inputSchema === "object",
    )
    .map(
      (d) =>
        [
          d.name,
          tool({
            ...(typeof d.description === "string"
              ? { description: d.description }
              : {}),
            inputSchema: jsonSchema(
              d.inputSchema as Record<string, unknown>,
            ) as any,
            ...(d.outputSchema
              ? {
                  outputSchema: jsonSchema(
                    d.outputSchema as Record<string, unknown>,
                  ) as any,
                }
              : {}),
          } as any),
        ] as const,
    );

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};
