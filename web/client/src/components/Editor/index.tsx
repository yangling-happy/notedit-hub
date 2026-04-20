import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import { useCallback } from "react";
import { useTheme } from "next-themes";
import { Welcome } from "../Welcome";
import {
  AIMenuController,
  AIToolbarButton,
  getAISlashMenuItems,
} from "@blocknote/xl-ai";
import {
  FormattingToolbarController,
  FormattingToolbar,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  getFormattingToolbarItems,
} from "@blocknote/react";
import { useEditor } from "../../contexts/editorContext";
import { extractTitle } from "../../utils/blockNoteUtils";

interface EditorProps {
  onSave?: (data: {
    id: string;
    title: string;
    content: Record<string, unknown>[];
    updatedAt: number;
  }) => void;
  noteId?: string;
}

export default function Editor({ onSave, noteId }: EditorProps) {
  const editor = useEditor();
  const { resolvedTheme } = useTheme();
  const themeValue = resolvedTheme === "dark" ? "dark" : "light";
  const handleSave = useCallback(() => {
    if (onSave && noteId) {
      const blocks = editor.document;
      const title = extractTitle(blocks);
      onSave({
        id: noteId,
        title: title,
        content: blocks,
        updatedAt: Date.now(),
      });
      window.dispatchEvent(
        new CustomEvent("WIKI_TITLE_UPDATED", {
          detail: { id: noteId, title },
        }),
      );
    }
  }, [onSave, noteId, editor.document]);

  if (!noteId) {
    return <Welcome />;
  }

  return (
    <BlockNoteView
      editor={editor}
      theme={themeValue}
      onChange={handleSave}
      // 禁用默认 UI，用 Controller手动挂载 AI 零件
      formattingToolbar={false}
      slashMenu={false}
    >
      <AIMenuController />

      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            {...getFormattingToolbarItems()}
            <AIToolbarButton />
          </FormattingToolbar>
        )}
      />

      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) =>
          filterSuggestionItems(
            [
              ...getDefaultReactSlashMenuItems(editor),
              ...getAISlashMenuItems(editor),
            ],
            query,
          )
        }
      />
    </BlockNoteView>
  );
}
