import { useState } from "react";
import { Input, Typography } from "antd";
import { useSearch } from "../../../hooks/useSearch";
import { useTranslation } from "react-i18next";

const { Search } = Input;
const { Text } = Typography;


export const SearchPanel = ({ editor }: { editor: any }) => {
  const { executeSearch } = useSearch(editor);
  const [results, setResults] = useState<any[]>([]);
const { t } = useTranslation();
  const handleJump = (blockId: string) => {
    if (!blockId) return;
    editor.setTextCursorPosition(blockId, "start");
    document
      .querySelector(`[data-id="${blockId}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });

    // 给跳转目标增加一个临时的视觉反馈（可选）
    const el = document.querySelector(`[data-id="${blockId}"]`);
    el?.classList.add("search-highlight");
    setTimeout(() => el?.classList.remove("search-highlight"), 1500);
  };

  const handleSearch = (value: string) => {
    const found = executeSearch(value);
    console.log(t("search.result_label"), found);
    setResults(found);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Search
        placeholder={t("search.placeholder")}
        onSearch={handleSearch}
        allowClear
      />

      {/* 搜索结果列表 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {results.map((item, index) => (
          <div
            key={index}
            onClick={() => handleJump(item.blockId)}
            style={{
              padding: "8px",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "#fafafa",
            }}
          >
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {t("search.result_label")} {index + 1}:
            </Text>
            <div style={{ fontWeight: 500 }}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
