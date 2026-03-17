import { useEffect, useState, useCallback, useRef } from "react";
import { List, Typography, Skeleton } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllDocuments } from "../../services/api";
import { useTranslation } from "react-i18next";

interface DocItem {
  _id: string;
  title: string;
  updatedAt: string;
}

export const WikiList = () => {
  const { t } = useTranslation();
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [_, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 使用 useRef 记录是否是初次挂载，防止逻辑竞争
  const isFirstMount = useRef(true);

  // 从路径中提取当前激活的文档 ID
  const currentId = location.pathname.startsWith("/wiki/")
    ? location.pathname.slice(6)
    : null;

  // 核心优化：增加 isSilent 参数
  const fetchDocs = useCallback(async (isSilent = false) => {
    // 如果是静默刷新，不展示 Skeleton
    if (!isSilent) setInitialLoading(true);

    setIsRefreshing(true);
    try {
      const data = await getAllDocuments();
      setDocs(data);
    } catch (_) {
      // 生产环境建议加上基本的错误反馈
    } finally {
      setInitialLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // 逻辑 1：组件挂载时执行一次全量加载（显示骨架屏）
  useEffect(() => {
    fetchDocs(false);
    isFirstMount.current = false;
  }, [fetchDocs]);

  // 逻辑 2：路由变化时执行静默刷新
  useEffect(() => {
    // 只有在非初次挂载，且路径确实是 wiki 路径时才触发
    if (!isFirstMount.current && location.pathname.startsWith("/wiki")) {
      // 此时 docs 通常已有数据，isSilent 设为 true 避免闪屏
      fetchDocs(true);
    }
  }, [location.pathname, fetchDocs]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "4px 0",
      }}
    >
      {/* 关键：只有 initialLoading 为 true 且没有数据时才显示骨架屏 */}
      <Skeleton
        loading={initialLoading && docs.length === 0}
        active
        paragraph={{ rows: 6 }}
      >
        {docs.length === 0 ? (
          <div />
        ) : (
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
