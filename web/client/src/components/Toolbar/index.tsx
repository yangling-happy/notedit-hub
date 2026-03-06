import { Button, Space } from "antd";
import {
  FileOutlined,
  FolderOpenOutlined,
  SaveOutlined,
  SettingOutlined,
} from "@ant-design/icons";

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
    }}
  >
    <Space>
      <Button type="text" icon={<FileOutlined />}>
        新建
      </Button>
      <Button type="text" icon={<FolderOpenOutlined />}>
        打开
      </Button>
      <Button type="text" icon={<SaveOutlined />}>
        保存
      </Button>
      <Button type="text" icon={<SettingOutlined />}>
        设置
      </Button>
    </Space>
    <div style={{ fontWeight: 600, fontSize: 16, color: "#1677ff" }}>
      Notedit 此处是顶部工具栏
    </div>
  </div>
);
