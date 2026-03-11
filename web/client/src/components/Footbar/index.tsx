import { BlockNoteEditor } from "@blocknote/core";


export const Footbar = ({ }: { editor: BlockNoteEditor }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        // borderTop: "2px solid var(--toolbar-border-color)",
        height: "30px",
        position: "sticky", 
        bottom: "0px",
        left: "0",
        right: "0",
        zIndex: 2,
        // backgroundColor: "var(--bg-color)", 
        flexShrink: 0, 
      }}
    >
      {/* 在这里添加底部栏的具体内容 */}
      <span>Footbar Content</span>
    </div>
  );
};