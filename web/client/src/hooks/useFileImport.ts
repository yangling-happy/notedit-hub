import { BlockNoteEditor } from "@blocknote/core";
import { clearEditor } from "../utils/clearEditor";
import { useCallback } from "react";

export const useFileImport = (editor: BlockNoteEditor | null) => {
  const importFile = useCallback(
    async (file: File) => {
      if (!editor) return;
      if (!file.name.endsWith(".md")) {
        alert("请选择一个Markdown文件进行导入");
        return;
      }
      try {
        const content = await file.text();
        const blocks = await editor.tryParseHTMLToBlocks(content);

        clearEditor(editor);
        editor.replaceBlocks(
          editor.document.map((b) => b.id),
          blocks,
        );
      } catch (error) {
        console.error("导入失败:", error);
      }
    },
    [editor],
  );

  return { importFile };
};
