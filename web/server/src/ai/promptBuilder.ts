import {
  DEFAULT_SYSTEM_PROMPT,
  FALLBACK_ID_POLICY_PROMPT,
} from "./constants.js";

export const buildIdGuardPrompt = (knownIds: string[]) => {
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

export const buildFinalSystemPrompt = (
  incomingSystemPrompt: string | undefined,
  knownIds: string[],
) => {
  return [
    incomingSystemPrompt || DEFAULT_SYSTEM_PROMPT,
    buildIdGuardPrompt(knownIds),
    FALLBACK_ID_POLICY_PROMPT,
  ].join("\n\n");
};
