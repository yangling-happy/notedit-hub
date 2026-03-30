import React from "react";
import { Splitter } from "antd";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { Toolbar } from "./components/Toolbar";
import { Footbar } from "./components/Footbar";
import "./styles/global.css";
import { en, zh } from "@blocknote/core/locales";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { ThemeBridge } from "./components/themeBridge";
import { useTranslation } from "react-i18next";
import "./locales/i18.ts";
import { useParams } from "react-router-dom";
import { getDocumentById, updateDocument } from "./services/document.ts";
import { AIExtension, aiDocumentFormats } from "@blocknote/xl-ai";
import { DefaultChatTransport } from "ai";
import { en as aiEn, zh as aiZh } from "@blocknote/xl-ai/locales";
import "@blocknote/xl-ai/style.css";
import { EditorProvider } from "./contexts/editorContext";
import { useCollaboration } from "./hooks/useCollaboration";
import { useAuth } from "./contexts/authContext";
import { useJoinDocumentFromUrl } from "./hooks/useJoinDocumentFromUrl.ts";
import { useImageUpload } from "./hooks/useImageUpload";

const COLLAB_COLORS = [
  "#e03131",
  "#2f9e44",
  "#1971c2",
  "#f08c00",
  "#7b2cbf",
  "#0b7285",
  "#c2255c",
  "#5c940d",
];

const getColorByName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % COLLAB_COLORS.length;
  return COLLAB_COLORS[index];
};

const App: React.FC = () => {
  const { user } = useAuth();
  const { uploadFile } = useImageUpload();

  const { i18n, ready, t } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  const { docId } = useParams<{ docId: string }>();
  const userName = user?.username ?? t("user.default_name");
  const userColor = useMemo(() => getColorByName(userName), [userName]);
  const docIdRef = useRef(docId);
  useEffect(() => {
    docIdRef.current = docId;
  }, [docId]);
  useJoinDocumentFromUrl();

  useEffect(() => {
    if (ready) setLang(i18n.language);
  }, [ready, i18n]);

  useEffect(() => {
    const handleLangChange = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18n]);

  const editorOptions = useMemo(
    () => ({
      dictionary: {
        ...(lang === "zh" ? zh : en),
        ai: lang === "zh" ? aiZh : aiEn,
      },
      uploadFile,
      extensions: [
        AIExtension({
          transport: new DefaultChatTransport({
            api: "http://localhost:3001/api/documents/chat",
            headers: () => {
              const token = localStorage.getItem("token");
              const headers: Record<string, string> = {};
              if (token) {
                headers.Authorization = `Bearer ${token}`;
              }
              return headers;
            },
            body: {
              systemPrompt: aiDocumentFormats.html.systemPrompt,
            },
          }),
          streamToolsProvider: aiDocumentFormats.html.getStreamToolsProvider({
            defaultStreamTools: {
              add: true,
              update: true,
              delete: true,
            },
          }),
          documentStateBuilder:
            aiDocumentFormats.html.defaultDocumentStateBuilder,
        }),
      ],
    }),
    [lang, uploadFile],
  );

  const { editor, status: collaborationStatus } = useCollaboration({
    docId,
    userName,
    userColor,
    editorOptions,
  });
  const isCollaborationEnabled = Boolean(docId);

  useEffect(() => {
    if (editor && docId) editor.focus();
  }, [editor, docId]);

  // 当 docId 或 editor 变化时，从 API 加载文档内容
  useEffect(() => {
    if (!editor) return;

    // 协同模式下由 Yjs/Hocuspocus 负责文档状态同步，避免 REST 全量覆盖引发冲突。
    if (isCollaborationEnabled) return;

    if (!docId) {
      // 无文档时清空编辑器
      try {
        editor.replaceBlocks(editor.document, [{ type: "paragraph" }]);
      } catch (_) {}
      return;
    }
    let cancelled = false; //竞态条件：如果在 fetch 过程中 docId 发生变化，或者组件卸载了，就不再执行 setState
    getDocumentById(docId)
      .then((doc) => {
        if (cancelled) return;
        const content =
          doc.content && Array.isArray(doc.content) && doc.content.length > 0
            ? doc.content
            : [{ type: "paragraph" }];
        try {
          editor.replaceBlocks(editor.document, content);
        } catch (_) {}
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [docId, editor, isCollaborationEnabled]);

  // 防抖保存：编辑 1s 后自动同步到 MongoDB
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSave = useCallback(
    (note: {
      id: string;
      title: string;
      content: any[];
      updatedAt: number;
    }) => {
      const currentDocId = docIdRef.current;
      if (!currentDocId) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        updateDocument(currentDocId, {
          title: note.title,
          content: note.content,
        }).catch(() => {});
      }, 1000);
    },
    [],
  );

  if (!ready) return <div>{t("common.loading")}</div>;

  return (
    <ThemeBridge>
      <EditorProvider editor={editor}>
        <div className="fixed-viewport">
          <Toolbar />
          <Splitter
            style={{ flex: 1, height: "calc(100% - 48px)", overflow: "hidden" }}
          >
            <Splitter.Panel
              className="sidebar-container sidebar-trigger"
              style={{ overflow: "hidden" }}
              collapsible={{ start: true, end: true }}
            >
              <div className="sidebar-hidden sidebar-scrollable">
                <Sidebar />
              </div>
            </Splitter.Panel>
            <Splitter.Panel
              className="main-content"
              min="20%"
              defaultSize="80%"
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div
                className="main-content-scrollable"
                style={{
                  padding: docId ? "15px 20px" : "0",
                  flex: 1,
                  overflow: "auto",
                }}
              >
                <Editor
                  key={lang}
                  onSave={handleSave}
                  noteId={docId ?? undefined}
                />
              </div>
              {docId && <Footbar collaborationStatus={collaborationStatus} />}
            </Splitter.Panel>
          </Splitter>
        </div>
      </EditorProvider>
    </ThemeBridge>
  );
};

export default App;
