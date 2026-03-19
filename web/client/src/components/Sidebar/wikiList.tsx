import { useEffect, useState, useCallback } from "react";
import { List, Typography, Skeleton } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getAllDocuments } from "../../services/api";
import { useTranslation } from "react-i18next";
import { DOCUMENTS_CHANGED_EVENT } from "../../constants/documentEvents";

interface DocItem {
  _id: string;
  title: string;
  updatedAt: string;
}

export const WikiList = () => {
  const { t } = useTranslation();
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { docId: currentId } = useParams<{ docId: string }>();

  const fetchDocs = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await getAllDocuments();
      setDocs(data);
    } catch (error) {
      console.error("Failed to fetch docs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs(true);
  }, [fetchDocs]);

  useEffect(() => {
    const handleDocumentsChanged = () => {
      fetchDocs();
    };

    window.addEventListener(DOCUMENTS_CHANGED_EVENT, handleDocumentsChanged);

    return () => {
      window.removeEventListener(
        DOCUMENTS_CHANGED_EVENT,
        handleDocumentsChanged,
      );
    };
  }, [fetchDocs]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "4px 0",
      }}
    >
      <Skeleton
        loading={loading && docs.length === 0}
        active
        paragraph={{ rows: 6 }}
      >
        {docs.length > 0 && (
          <List
            dataSource={docs}
            renderItem={(doc) => {
              const isActive = doc._id === currentId;
              return (
                <List.Item
                  onClick={() => navigate(`/wiki/${doc._id}`)}
                  style={{
                    cursor: "pointer",
                    padding: "8px 12px",
                    borderRadius: 8,
                    margin: "2px 8px",
                    backgroundColor: isActive
                      ? "rgba(22, 119, 255, 0.08)"
                      : "transparent",
                    transition: "all 0.2s",
                    border: "none",
                  }}
                  className="wiki-list-item"
                >
                  <List.Item.Meta
                    avatar={
                      <FileTextOutlined
                        style={{
                          fontSize: "16px",
                          color: isActive
                            ? "var(--text-secondary-color)"
                            : "var(--text-placeholder-color)",
                          marginTop: "4px",
                        }}
                      />
                    }
                    title={
                      <Typography.Text
                        ellipsis
                        strong={isActive}
                        style={{
                          color: isActive
                            ? "var(--text-primary-color)"
                            : "var(--text-secondary-color)",
                          fontSize: 14,
                        }}
                      >
                        {doc.title || t("sidebar.wiki_untitled")}
                      </Typography.Text>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Skeleton>
    </div>
  );
};
