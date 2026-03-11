import File from "./file";
import { GithubOutlined } from "@ant-design/icons";
import { BlockNoteEditor } from "@blocknote/core";
import { ModeToggle } from "./modeToogle";
export const Toolbar = ({ editor }: { editor: BlockNoteEditor }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 16px",
         borderBottom: "2px solid var(--toolbar-border-color)",
      height: "48px",
      position: "sticky",
      top: "0px",
      zIndex: 2,
    }}
  >
    <div>
      <File editor={editor} />
    </div>
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: 600,
        fontSize: 16,
      }}
    >
      NOTEDIT
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <ModeToggle />
      <a
        href="https://github.com/yangling-happy/notedit-hub"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: "28px",
          color: "var(--toolbar-icon-color)",
        }}
      >
        <GithubOutlined />
      </a>
    </div>
  </div>
);
