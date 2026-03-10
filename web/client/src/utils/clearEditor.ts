import { BlockNoteEditor } from "@blocknote/core";

export const clearEditor = (editor: BlockNoteEditor) => {
  const blockIds = editor.document.map((block) => block.id);
  editor.replaceBlocks(blockIds, []);
  editor.focus();
};
