import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";
import { useCreateBlockNote } from "@blocknote/react";
import i18n from "../locales/i18";

/**
 * 协作连接状态类型
 * @public
 */
export type CollaborationStatus =
  | "disabled" // 协作功能关闭
  | "connecting" // 正在建立连接或等待 Yjs 首次同步
  | "connected" // WebSocket 已建立且 Yjs 已与服务器完成同步
  | "disconnected"; // 连接已断开或认证失败

/**
 * `useCollaboration` Hook 的配置选项
 */
interface UseCollaborationOptions {
  /** * 文档唯一标识符
   * @remarks
   * 这是开启协作的关键。如果传入 `undefined` 或空字符串，
   * 内部逻辑将判定协作功能为关闭状态。
   */
  docId?: string;
  /** 当前显示的用户名 */
  userName?: string;
  /** 用户在编辑器中光标显示的颜色（十六进制） */
  userColor?: string;
  /** 传递给 BlockNote 的原始配置项 */
  editorOptions?: Parameters<typeof useCreateBlockNote>[0];
}

type BlockNoteOptions = NonNullable<Parameters<typeof useCreateBlockNote>[0]>;
type BlockNoteCollaborationOptions = NonNullable<
  BlockNoteOptions["collaboration"]
>;

/**
 * 内部辅助函数：根据环境变量获取并格式化协作服务器的 WebSocket URL
 * * @returns 格式化后的 WebSocket 地址
 * @internal
 */
const getCollabWsUrl = () => {
  const raw = (
    import.meta.env.VITE_COLLAB_WS_URL as string | undefined
  )?.trim();

  if (raw) {
    if (raw.startsWith("ws://") || raw.startsWith("wss://")) {
      return raw.replace(/\/+$/, "");
    }

    if (raw.startsWith("/")) {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      return `${protocol}://${window.location.host}${raw}`.replace(/\/+$/, "");
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${raw}`.replace(/\/+$/, "");
  }

  return "ws://localhost:3001";
};

/** 短暂断线防抖，避免底栏在重连抖动时误判为已断开 */
const DISCONNECT_DEBOUNCE_MS = 480;

/**
 * 处理编辑器协作逻辑的自定义 Hook
 * * @param options - 协作配置项 {@link UseCollaborationOptions}
 * * @remarks
 * **协作开关逻辑说明：**
 * 该 Hook 会自动检测 `docId` 的有效性：
 * - 如果 `docId` 为空（`undefined`），`status` 将始终保持为 `"disabled"`，且不会创建 Yjs 实例。
 * - 如果 `docId` 存在，Hook 将自动尝试连接 Hocuspocus 服务端。
 * * @example
 * ```tsx
 * // 开启协作模式
 * const { editor, status } = useCollaboration({ docId: "my-doc-1" });
 * * // 纯本地模式
 * const { editor } = useCollaboration({ docId: undefined });
 * ```
 * * @returns 返回包含 BlockNote 编辑器实例和当前连接状态的对象
 */
export const useCollaboration = ({
  docId,
  userName = i18n.t("user.default_name"),
  userColor = "#ffcc00",
  editorOptions,
}: UseCollaborationOptions) => {
  const isCollaborationEnabled = Boolean(docId);

  const [bundle, setBundle] = useState<{
    ydoc: Y.Doc;
    provider: HocuspocusProvider;
  } | null>(null);

  /** 有 docId 时的连接态；无 docId 时由 {@link status} 派生为 disabled */
  const [connStatus, setConnStatus] =
    useState<Exclude<CollaborationStatus, "disabled">>("connecting");

  const status: CollaborationStatus = docId ? connStatus : "disabled";

  useEffect(() => {
    if (!docId) {
      return;
    }

    // 与 Hocuspocus 会话对齐：切换 docId 时必须立刻回到「连接/同步中」，不能沿用上一文档的 connected/disconnected
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 外部连接生命周期与 React 状态同步
    setConnStatus("connecting");

    let cancelled = false;
    let disconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const clearDisconnectTimer = () => {
      if (disconnectTimer) {
        clearTimeout(disconnectTimer);
        disconnectTimer = null;
      }
    };

    const scheduleDisconnected = () => {
      clearDisconnectTimer();
      disconnectTimer = setTimeout(() => {
        disconnectTimer = null;
        if (cancelled) return;
        setConnStatus("disconnected");
      }, DISCONNECT_DEBOUNCE_MS);
    };

    const ydoc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: getCollabWsUrl(),
      name: docId,
      document: ydoc,
      token: () => localStorage.getItem("token") || "",
      onSynced: ({ state }) => {
        if (cancelled || !state) return;
        clearDisconnectTimer();
        setConnStatus("connected");
      },
      onStatus: ({ status: wsStatus }) => {
        if (cancelled) return;
        if (wsStatus === WebSocketStatus.Disconnected) {
          scheduleDisconnected();
          return;
        }
        clearDisconnectTimer();
        if (wsStatus === WebSocketStatus.Connecting) {
          setConnStatus("connecting");
          return;
        }
        if (wsStatus === WebSocketStatus.Connected) {
          // WebSocket 已就绪，但 Yjs 可能尚未收到 Sync Step2；以 provider.synced / onSynced 为准
          setConnStatus(provider.synced ? "connected" : "connecting");
        }
      },
      onDisconnect: () => {
        if (cancelled) return;
        scheduleDisconnected();
      },
      onAuthenticationFailed: () => {
        if (cancelled) return;
        clearDisconnectTimer();
        setConnStatus("disconnected");
      },
    });

    setBundle({ ydoc, provider });
    void provider.configuration.websocketProvider.connect();

    return () => {
      cancelled = true;
      clearDisconnectTimer();
      provider.destroy();
      ydoc.destroy();
      setBundle(null);
    };
  }, [docId]);

  const collaborationConfig = useMemo(() => {
    if (!bundle || !docId || !isCollaborationEnabled) return undefined;

    return {
      provider: bundle.provider as NonNullable<
        BlockNoteCollaborationOptions["provider"]
      >,
      fragment: bundle.ydoc.getXmlFragment("blocknote"),
      user: {
        name: userName,
        color: userColor,
      },
    };
  }, [bundle, docId, userName, userColor, isCollaborationEnabled]);

  const editor = useCreateBlockNote(
    {
      ...(editorOptions ?? {}),
      ...(collaborationConfig ? { collaboration: collaborationConfig } : {}),
    },
    [editorOptions, collaborationConfig, docId, userName, userColor],
  );

  return { editor, status };
};
