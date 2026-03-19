import { Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { deleteDocument } from "../../../services/api";

export const DeleteButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { docId } = useParams<{ docId: string }>();

  const handleDelete = async () => {
    if (!docId) {
      message.warning(t("common.delete_no_document"));
      return;
    }

    try {
      await deleteDocument(docId);
      navigate("/wiki");
      message.success(t("common.delete_success"));
    } catch (error) {
      console.error("Failed to delete document:", error);
      message.error(t("common.delete_failed"));
    }
  };

  return (
    <Button type="default" icon={<DeleteOutlined />} onClick={handleDelete}>
      {t("toolbar.delete")}
    </Button>
  );
};
