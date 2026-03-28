import { useWordCount } from "../../hooks/useWordCount";
import { useTranslation } from "react-i18next";
import { useEditor } from "../../contexts/editorContext";
import type { CollaborationStatus } from "../../hooks/useCollaboration";

interface FootbarProps {
  collaborationStatus?: CollaborationStatus;
}

const STATUS_MAP: Record<CollaborationStatus, { key: string; color: string }> =
  {
    disabled: {
      key: "footbar.collab_disabled",
      color: "var(--toolbar-icon-color)",
    },
    connecting: {
      key: "footbar.collab_connecting",
      color: "var(--toolbar-icon-color)",
    },
    connected: {
      key: "footbar.collab_connected",
      color: "var(--toolbar-icon-color)",
    },
    disconnected: {
      key: "footbar.collab_disconnected",
      color: "var(--toolbar-icon-color)",
    },
  };

export const Footbar = ({ collaborationStatus = "disabled" }: FootbarProps) => {
  const editor = useEditor();
  const wordCount = useWordCount(editor);
  const { t } = useTranslation();
  const currentStatus = STATUS_MAP[collaborationStatus];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: currentStatus.color,
          fontSize: 14,
          userSelect: "none",
        }}
      >
        {t(currentStatus.key)}
      </span>

      <span
        style={{
          fontSize: 14,
        }}
      >
        {t("footbar.word_count")}
        {wordCount}
      </span>
    </div>
  );
};
