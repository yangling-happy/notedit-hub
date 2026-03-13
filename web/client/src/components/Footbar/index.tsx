import { BlockNoteEditor } from "@blocknote/core";
import { useWordCount } from "../../hooks/useWordCount";

export const Footbar = ({ editor }: { editor: BlockNoteEditor }) => {
  const wordCount = useWordCount(editor);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "8px 16px",
        height: "30px",
        position: "sticky",
        bottom: "0px",
        left: "0",
        right: "0",
        zIndex: 2,
        flexShrink: 0,
      }}
    >
      <span>字符数（不计空格）：{wordCount}</span>
    </div>
  );
};
