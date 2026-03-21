import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor } from "@blocknote/core";
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
interface EditorProps {
  editor: BlockNoteEditor;
  onSave?: (content: any) => void;
  noteId?: string;
}

export default function Editor({ editor, onSave, noteId }: EditorProps) {
  const { resolvedTheme } = useTheme();
  const themeValue = resolvedTheme === "dark" ? "dark" : "light";
  const handleSave = useCallback(() => {
    if (onSave && noteId) {
      onSave({
        id: noteId,
        content: editor.document,
        updatedAt: Date.now(),
      });
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
      // 禁用默认 UI，因为我们要用 Controller 手动挂载 AI 零件
      formattingToolbar={false}
      slashMenu={false}
    >
      {/* A. AI 核心控制器（必放） */}
      <AIMenuController />

      {/* B. 自定义格式化工具栏：把 AI 按钮塞进去 */}
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            {...getFormattingToolbarItems()}
            <AIToolbarButton />
          </FormattingToolbar>
        )}
      />

      {/* C. 自定义斜杠菜单：把 AI 选项合并进去 */}
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
