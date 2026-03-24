import { Avatar, Dropdown, Space, Typography } from "antd";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAuth } from "../../../contexts/authContext";

export const UserMenu = () => {
  const { user, logout } = useAuth();

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomLeft">
      <Space
        style={{
          cursor: "pointer",
          userSelect: "none",
          paddingRight: 8,
          borderRight: "1px solid var(--toolbar-border-color)",
          marginRight: 4,
        }}
      >
        <Avatar size="small" icon={<UserOutlined />} />
        <Typography.Text style={{ marginBottom: 0 }}>
          {user?.username ?? "用户"}
        </Typography.Text>
        <DownOutlined
          style={{ fontSize: 12, color: "var(--text-secondary-color)" }}
        />
      </Space>
    </Dropdown>
  );
};
