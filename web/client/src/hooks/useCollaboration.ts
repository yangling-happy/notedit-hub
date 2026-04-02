import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useCreateBlockNote } from "@blocknote/react";
import i18n from "../locales/i18";

/**
 * 协作连接状态类型
 * @public
 */
export type CollaborationStatus =
  | "disabled" // 协作功能关闭
  | "connecting" // 正在建立 WebSocket 连接
  | "connected" // 已成功连接并同步数据
  | "disconnected"; // 连接已断开或认证失败

/**
 * `useCollaboration` Hook 的配置选项
 */
interface CollaborationOptions {
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

/**
 * 处理编辑器协作逻辑的自定义 Hook
 * * @param options - 协作配置项 {@link CollaborationOptions}
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
}: CollaborationOptions) => {
  /** 标识协作功能是否激活 */
  const isCollaborationEnabled = Boolean(docId);

  const [status, setStatus] = useState<CollaborationStatus>(
    isCollaborationEnabled ? "connecting" : "disabled",
  );

  /**
   * 将 Hocuspocus 内部状态映射为业务状态
   * @param nextStatus - Hocuspocus 提供的原始状态
   */
  const mapStatus = (nextStatus?: string): CollaborationStatus => {
    if (nextStatus === "connected") return "connected";
    if (nextStatus === "disconnected") return "disconnected";
    return "connecting";
  };

  /**
   * 初始化 Yjs 文档和 Hocuspocus Provider
   * @remarks
   * 仅在 `isCollaborationEnabled` 为 true 时才会实例化
   */
  const { provider, ydoc } = useMemo(() => {
    if (!isCollaborationEnabled || !docId) {
      return { provider: null, ydoc: null };
    }

    const ydoc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: getCollabWsUrl(),
      name: docId,
      document: ydoc,
      token: () => localStorage.getItem("token") || "",
      onConnect: () => setStatus("connected"),
      onDisconnect: () => setStatus("disconnected"),
      onAuthenticationFailed: () => setStatus("disconnected"),
      onStatus: ({ status: nextStatus }) => {
        setStatus(mapStatus(nextStatus));
      },
    });

    return { provider, ydoc };
  }, [docId, isCollaborationEnabled]);

  /**
   * 组装 BlockNote 协作插件所需的配置对象
   */
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

  /**
   * 创建 BlockNote 实例
   * 将协作配置注入到编辑器配置中
   */
  const editor = useCreateBlockNote(
    {
      ...(editorOptions ?? {}),
      ...(collaborationConfig ? { collaboration: collaborationConfig } : {}),
    },
    [editorOptions, collaborationConfig, docId, userName, userColor],
  );

  /**
   * 生命周期管理
   * 负责连接的建立和销毁清理
   */
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
