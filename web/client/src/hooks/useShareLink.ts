import { useCallback, useEffect, useState } from "react";
import { createShareLink } from "../services/document";

export const useShareLink = (docId?: string) => {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl("");
  }, [docId]);

  const ensureShareUrl = useCallback(async () => {
    if (!docId) return "";
    if (shareUrl) return shareUrl;

    setLoading(true);
    try {
      const data = await createShareLink(docId);
      const nextShareUrl = typeof data?.shareUrl === "string" ? data.shareUrl : "";
      setShareUrl(nextShareUrl);
      return nextShareUrl;
    } finally {
      setLoading(false);
    }
  }, [docId, shareUrl]);

  return {
    loading,
    shareUrl,
    canShare: Boolean(docId),
    ensureShareUrl,
  };
};