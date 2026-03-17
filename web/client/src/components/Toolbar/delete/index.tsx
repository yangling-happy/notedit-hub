import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const DeleteButton = () => {
  const { t } = useTranslation();

  return (
    <Button type="default" icon={<DeleteOutlined />} >
      {t("toolbar.delete")}
    </Button>
  );
};