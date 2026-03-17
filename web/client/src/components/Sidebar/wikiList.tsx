import { Button } from "antd";
import { useTranslation } from "react-i18next";

export const WikiList = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
        }}
      >
        {/* 可在此处添加文件列表内容 */}
      </div>
      <Button type="text" block style={{ flexShrink: 0 }}>
        {t("filelist.new_document")}
      </Button>
    </div>
  );
};