import { useOutline } from "../../hooks/use-outline";
import type { Block, BlockNoteEditor } from "@blocknote/core";

interface OutlineProps {
  editor: BlockNoteEditor;
}

export const Outline: React.FC<OutlineProps> = ({ editor }: OutlineProps) => {
  const headings = useOutline(editor);

  if (!headings || headings.length === 0) {
    return <div></div>;
  }
  const handleJump = (block: Block) => {
    const element = document.querySelector(`[data-id="${block.id}"]`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="outline-list" style={{ padding: "0 8px" }}>
      {headings.map((block) => (
        <div
          key={block.id}
          style={{
            padding: "4px 0",

            paddingLeft: (block.props.level - 1) * 16,
            cursor: "pointer",
            fontSize: block.props.level === 1 ? "14px" : "13px",
            fontWeight: block.props.level === 1 ? "600" : "normal",
          }}
          onClick={() => {
            handleJump(block);
          }}
        >
          {block.content.map((c: any) => c.text).join("") || "无题"}
        </div>
      ))}
    </div>
  );
};
