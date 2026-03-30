import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useCreateBlockNote } from "@blocknote/react";
import i18n from "../locales/i18";

export type CollaborationStatus =
  | "disabled"
  | "connecting"
  | "connected"
  | "disconnected";

interface CollaborationOptions {
  docId?: string;
  userName?: string;
  userColor?: string;
  editorOptions?: Parameters<typeof useCreateBlockNote>[0];
}

const getCollabWsUrl = () => {
  const raw = (
    import.meta.env.VITE_COLLAB_WS_URL as string | undefined
  )?.trim();

  if (raw) {
    if (raw.startsWith("ws://") || raw.startsWith("wss://")) {
      return raw.replace(/\/+$/, "");
    }

    // 兼容仅填 host:port 或 /path 的配置，自动补协议
    if (raw.startsWith("/")) {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      return `${protocol}://${window.location.host}${raw}`.replace(/\/+$/, "");
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${raw}`.replace(/\/+$/, "");
  }

  return "ws://localhost:3001";
};

export const useCollaboration = ({
  docId,
  userName = i18n.t("user.default_name"),
  userColor = "#ffcc00",
  editorOptions,
}: CollaborationOptions) => {
  const isCollaborationEnabled = Boolean(docId);
  const [status, setStatus] = useState<CollaborationStatus>(
    isCollaborationEnabled ? "connecting" : "disabled",
  );

  const mapStatus = (nextStatus?: string): CollaborationStatus => {
    if (nextStatus === "connected") return "connected";
    if (nextStatus === "disconnected") return "disconnected";
    return "connecting";
  };

  const { provider, ydoc } = useMemo(() => {
    if (!isCollaborationEnabled || !docId) {
      return { provider: null, ydoc: null };
    }

    const ydoc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: getCollabWsUrl(),
      // 文档名只保留业务 docId，路径由 url 决定。
      name: docId,
      document: ydoc,
      onConnect: () => {
        setStatus("connected");
      },
      onDisconnect: () => {
        setStatus("disconnected");
      },
      onStatus: ({ status: nextStatus }) => {
        setStatus(mapStatus(nextStatus));
      },
    });

    return { provider, ydoc };
  }, [docId, isCollaborationEnabled]);

  const collaborationConfig = useMemo(() => {
    if (!provider || !ydoc || !isCollaborationEnabled) return undefined;

    return {
      provider: provider as any,
      fragment: ydoc.getXmlFragment("blocknote"),
      user: {
        name: userName,
        color: userColor,
      },
    };
  }, [provider, ydoc, userName, userColor, isCollaborationEnabled]);

  const editor = useCreateBlockNote(
    {
      ...(editorOptions ?? {}),
      ...(collaborationConfig ? { collaboration: collaborationConfig } : {}),
    },
    [editorOptions, collaborationConfig, docId, userName, userColor],
  );

  useEffect(() => {
    if (!isCollaborationEnabled) {
      setStatus("disabled");
      return;
    }

    if (!provider || !ydoc) return;

    setStatus("connecting");

    void provider.configuration.websocketProvider.connect();

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [provider, ydoc, isCollaborationEnabled]);

  return { editor, status };
};
