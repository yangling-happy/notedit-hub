import File from "./file";
import { GithubOutlined } from "@ant-design/icons";

export const Toolbar = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 16px",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e8e8e8",
      height: "48px",
      position: "sticky",
      top: "0px",
      zIndex: 2,
    }}
  >
    <div>
      <File />
    </div>
    <div style={{ fontWeight: 600, fontSize: 16, color: "black" }}>NOTEDIT</div>
    <a href="https://github.com/yangling-happy/notedit-hub" target="_blank" rel="noopener noreferrer" style={{
        color: "black", 
        fontSize: "24px",
      }}>
      <GithubOutlined />
    </a>
  </div>
);
