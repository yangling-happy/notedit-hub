import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

interface EditorProps {
  editor: any;
}
export default function Editor({ editor }: EditorProps) {
  return <BlockNoteView editor={editor} />;
}
