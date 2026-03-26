import { Avatar, Dropdown, Space, Typography } from "antd";
import {
  CaretDownOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAuth } from "../../../contexts/authContext";
import { useTranslation } from "react-i18next";

export const UserMenu = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: t("user.logout"),
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
          {user?.username ?? t("user.default_name")}
        </Typography.Text>
        <CaretDownOutlined />
      </Space>
    </Dropdown>
  );
};
