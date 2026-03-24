import type { DocumentStateLike } from "./types.js";

export const getLatestDocumentState = (
  uiMessages: unknown[],
): DocumentStateLike | null => {
  for (let i = uiMessages.length - 1; i >= 0; i--) {
    const candidate = (uiMessages[i] as any)?.metadata?.documentState;
    if (candidate && typeof candidate === "object") {
      return candidate as DocumentStateLike;
    }
  }

  return null;
};

export const extractKnownBlockIds = (
  documentState: DocumentStateLike | null,
) => {
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
