import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { SaveOutlined } from "@ant-design/icons";
export const SaveButton = () => {
  const { t } = useTranslation();

  return (
    <Button type="default" icon={<SaveOutlined />} >
      {t("toolbar.save")}
    </Button>
  );
};