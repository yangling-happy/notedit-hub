import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
export const CreateButton = () => {
  const { t } = useTranslation();

  return (
    <Button type="default" icon={<PlusOutlined />} >
      {t("toolbar.create")}
    </Button>
  );
};