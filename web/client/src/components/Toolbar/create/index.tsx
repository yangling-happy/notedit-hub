import { Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createDocument } from "../../../services/api.ts";

export const CreateButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const newDoc = await createDocument(t("filelist.untitled") || "Untitled");
      if (newDoc && newDoc._id) {
        navigate(`/wiki/${newDoc._id}`);
        message.success(t("common.create_success") || "Created");
      }
    } catch (error) {
      console.error("Failed to create document:", error);
      message.error("Create failed");
    }
  };

  return (
    <Button type="default" icon={<PlusOutlined />} onClick={handleCreate}>
      {t("toolbar.create")}
    </Button>
  );
};
