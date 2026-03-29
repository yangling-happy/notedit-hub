import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { joinDocument } from "../services/document";
import { notifyDocumentsChanged } from "../constants/documentEvents";

export const useJoinDocumentFromUrl = () => {
  const { user } = useAuth();
  const { docId } = useParams<{ docId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const joinedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const shouldJoin = searchParams.get("join") === "1";
    if (!shouldJoin) return;
    if (!user || !docId) return;

    const joinKey = `${user.id}:${docId}`;
    if (joinedKeyRef.current === joinKey) return;
    joinedKeyRef.current = joinKey;

    joinDocument(docId)
      .then(() => {
        notifyDocumentsChanged();
      })
      .catch((error) => {
        console.error("加入文档失败:", error);
      })
      .finally(() => {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete("join");
            return next;
          },
          { replace: true },
        );
      });
  }, [searchParams, user, docId, setSearchParams]);
};