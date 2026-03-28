import { BlockNoteEditor } from "@blocknote/core";
import { clearEditor } from "../utils/clearEditor";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const useFileImport = (editor: BlockNoteEditor | null) => {
  const { t } = useTranslation();

  const importFile = useCallback(
    async (file: File) => {
      if (!editor) return;
      if (!file.name.endsWith(".md")) {
        alert(t("file.import_markdown_prompt"));
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
        console.error(t("error.import_failed"), error);
      }
    },
    [editor, t],
  );

  return { importFile };
};
