import { Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createDocument } from "../../../services/api";
import { notifyDocumentsChanged } from "../../../constants/documentEvents";

export const CreateButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const newDoc = await createDocument(t("filelist.untitled"));
      if (newDoc && newDoc._id) {
        notifyDocumentsChanged();
        navigate(`/wiki/${newDoc._id}`);
        message.success(t("common.create_success"));
      }
    } catch (error) {
      console.error("Failed to create document:", error);
      message.error(t("common.create_failed"));
    }
  };

  return (
    <Button type="default" icon={<PlusOutlined />} onClick={handleCreate}>
      {t("toolbar.create")}
    </Button>
  );
};
