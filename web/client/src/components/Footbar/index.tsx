import { useWordCount } from "../../hooks/useWordCount";
import { useTranslation } from "react-i18next";
import { useEditor } from "../../contexts/editorContext";

export const Footbar = () => {
  const editor = useEditor();
  const wordCount = useWordCount(editor);
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "8px 16px",
        height: "30px",
        position: "sticky",
        bottom: "0px",
        left: "0",
        right: "0",
        zIndex: 2,
        flexShrink: 0,
      }}
    >
      <span>
        {t("footbar.word_count")}
        {wordCount}
      </span>
    </div>
  );
};
