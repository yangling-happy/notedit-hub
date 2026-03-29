import { Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteDocument,
  getAllDocuments,
  getDocumentById,
} from "../../../services/document";
import { notifyDocumentsChanged } from "../../../constants/documentEvents";
import { useAuth } from "../../../contexts/authContext";

export const DeleteButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { docId } = useParams<{ docId: string }>();
  const { user } = useAuth();

  const getOwnerId = (owner: unknown) => {
    if (typeof owner === "string") return owner;
    if (owner && typeof owner === "object" && "_id" in owner) {
      const maybeOwner = owner as { _id?: unknown };
      return typeof maybeOwner._id === "string" ? maybeOwner._id : "";
    }
    return "";
  };

  const showOnlyOwnerCanDeleteModal = () => {
    Modal.info({
      title: t("modal.delete_owner_only_title"),
      content: t("modal.delete_owner_only_content"),
      okText: t("modal.confirm"),
    });
  };

  const handleDelete = async () => {
    if (!docId) {
      message.warning(t("common.delete_no_document"));
      return;
    }

    if (!user?.id) {
      message.error(t("common.delete_failed"));
      return;
    }

    try {
      const doc = await getDocumentById(docId);
      const ownerId = getOwnerId(doc?.owner);

      if (!ownerId || ownerId !== user.id) {
        showOnlyOwnerCanDeleteModal();
        return;
      }
    } catch (error) {
      console.error("Failed to load document before delete:", error);
      message.error(t("common.delete_failed"));
      return;
    }

    Modal.confirm({
      title: t("modal.delete_document_confirm"),
      okText: t("modal.confirm"),
      cancelText: t("modal.cancel"),
      onOk: async () => {
        try {
          await deleteDocument(docId);
          notifyDocumentsChanged();
          const remainingDocs = await getAllDocuments();
          if (remainingDocs && remainingDocs.length > 0) {
            navigate(`/wiki/${remainingDocs[0]._id}`);
          } else {
            navigate("/wiki");
          }

          message.success(t("common.delete_success"));
        } catch (error) {
          console.error("Failed to delete document:", error);
          message.error(t("common.delete_failed"));
        }
      },
    });
  };

  return (
    <Button type="default" icon={<DeleteOutlined />} onClick={handleDelete}>
      {t("toolbar.delete")}
    </Button>
  );
};
