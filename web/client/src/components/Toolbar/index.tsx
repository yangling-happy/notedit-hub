import File from "./file";
import { GithubOutlined } from "@ant-design/icons";
import { ModeToggle } from "./modeToogle";
import { SearchPanel } from "./search";
import { LanguageSwitcher } from "./i18";
import { CreateButton } from "./create";
import { DeleteButton } from "./delete";
import { useEditor } from "../../contexts/editorContext";
import { UserMenu } from "./user";
import { ShareButton } from "./share";

export const Toolbar = () => {
  const editor = useEditor();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 24px",
        borderBottom: "2px solid var(--toolbar-border-color)",
        height: "48px",
        position: "sticky",
        top: "0px",
        zIndex: 2,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}
      >
        <File editor={editor} />
        <CreateButton />
        <DeleteButton />
        <ShareButton />
      </div>

      <div
        style={{
          fontWeight: 600,
          fontSize: 18,
          textAlign: "center",
        }}
      >
        NOTEDIT
      </div>

      {/* 右侧区域 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <SearchPanel editor={editor} />
        <LanguageSwitcher />
        <ModeToggle />
        <a
          href="https://github.com/yangling-happy/notedit-hub"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "24px",
            color: "var(--toolbar-icon-color)",
          }}
        >
          <GithubOutlined />
        </a>
        <UserMenu />
      </div>
    </div>
  );
};
