import { Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { ShareAltOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useShareLink } from "../../../hooks/useShareLink";
import { ShareLinkModal } from "./shareLinkModal";

export const ShareButton = () => {
  const { t } = useTranslation();
  const { docId } = useParams<{ docId: string }>();
  const [open, setOpen] = useState(false);
  const { canShare, loading, shareUrl, ensureShareUrl } = useShareLink(docId);

  const copyText = async (text: string) => {
    if (!text) return;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const handleShare = async () => {
    if (!docId) {
      message.warning(t("toolbar.share_no_document"));
      return;
    }

    try {
      const nextShareUrl = await ensureShareUrl();
      if (!nextShareUrl) {
        message.error(t("toolbar.share_failed"));
        return;
      }

      await copyText(nextShareUrl);
      message.success(t("toolbar.share_copied"));
      setOpen(true);
    } catch (error) {
      console.error("分享失败:", error);
      message.error(t("toolbar.share_failed"));
    }
  };

  const handleCopyAgain = async () => {
    if (!shareUrl) return;
    try {
      await copyText(shareUrl);
      message.success(t("toolbar.share_copied"));
    } catch (error) {
      console.error("复制失败:", error);
      message.error(t("toolbar.share_copy_failed"));
    }
  };

  return (
    <>
      <Button
        type="default"
        icon={<ShareAltOutlined />}
        onClick={handleShare}
        disabled={!canShare}
        loading={loading}
      >
        {t("toolbar.share")}
      </Button>

      <ShareLinkModal
        open={open}
        shareUrl={shareUrl}
        loading={loading}
        title={t("toolbar.share_modal_title")}
        tip={t("toolbar.share_modal_tip")}
        copyText={t("toolbar.share_copy_link")}
        onCancel={() => setOpen(false)}
        onCopy={handleCopyAgain}
      />
    </>
  );
};