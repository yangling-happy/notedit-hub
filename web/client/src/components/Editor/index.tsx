import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteEditor } from "@blocknote/core";
import { useCallback } from "react";
import { useTheme } from "next-themes";

interface EditorProps {
  editor: BlockNoteEditor;
  onSave?: (content: any) => void;
  noteId?: string;
}

export default function Editor({ editor, onSave, noteId }: EditorProps) {
  const {resolvedTheme} = useTheme();
  const themeValue = resolvedTheme === 'dark' ? 'dark' : 'light';
  const handleSave = useCallback(() => {
    if (onSave && noteId) {
      onSave({
        id: noteId,
        content: editor.document,
        updatedAt: Date.now(),
      });
    }
  }, [onSave, noteId, editor.document]);

  return <BlockNoteView editor={editor} theme={themeValue} onChange={handleSave} />;
}
