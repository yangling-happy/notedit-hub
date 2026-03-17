import React from "react";
import { Splitter } from "antd";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { Toolbar } from "./components/Toolbar";
import { Footbar } from "./components/Footbar";
import "./styles/global.css";
import { useCreateBlockNote } from "@blocknote/react";
import { en, zh } from "@blocknote/core/locales";
import { useEffect, useState, useCallback, useRef } from "react";
import { ThemeBridge } from "./components/themeBridge";
import { useTranslation } from "react-i18next";
import "./locales/i18.ts";
import { useLocation } from "react-router-dom";
import { getDocumentById, updateDocument } from "./services/api";

const App: React.FC = () => {
  async function uploadFile(file: File) {
    const body = new FormData();
    body.append("file", file);
    const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: body,
    });
    return (await ret.json()).data.url.replace(
      "tmpfiles.org/",
      "tmpfiles.org/dl/",
    );
  }

  const { i18n, ready } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const location = useLocation();

  // 从 URL 路径中提取文档 ID，例如 /wiki/:id
  const docId = location.pathname.startsWith("/wiki/")
    ? location.pathname.slice(6)
    : null;

  const docIdRef = useRef(docId);
  useEffect(() => {
    docIdRef.current = docId;
  }, [docId]);

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

  const editor = useCreateBlockNote(
    { dictionary: lang === "zh" ? zh : en, uploadFile },
    [lang],
  );

  useEffect(() => {
    if (editor) editor.focus();
  }, [editor]);

  // 当 docId 或 editor 变化时，从 API 加载文档内容
  useEffect(() => {
    if (!editor) return;
    if (!docId) {
      // 无文档时清空编辑器
      try {
        editor.replaceBlocks(editor.document, [{ type: "paragraph" }]);
      } catch (_) {}
      return;
    }
    let cancelled = false;
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
  }, [docId, editor]);

  // 防抖保存：编辑 1s 后自动同步到 MongoDB
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSave = useCallback(
    (note: { id: string; content: any[]; updatedAt: number }) => {
      const currentDocId = docIdRef.current;
      if (!currentDocId) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        updateDocument(currentDocId, { content: note.content }).catch(() => {});
      }, 1000);
    },
    [],
  );

  if (!ready) return <div>Loading...</div>;

  return (
    <ThemeBridge>
      <div className="fixed-viewport">
        <Toolbar editor={editor} />
        <Splitter
          style={{ flex: 1, height: "calc(100% - 48px)", overflow: "hidden" }}
        >
          <Splitter.Panel
            className="sidebar-container sidebar-trigger"
            style={{ overflow: "hidden" }}
            collapsible={{ start: true, end: true }}
          >
            <div className="sidebar-hidden sidebar-scrollable">
              <Sidebar editor={editor} />
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
              style={{ padding: "15px 20px", flex: 1, overflow: "auto" }}
            >
              <Editor
                key={lang}
                editor={editor}
                onSave={handleSave}
                noteId={docId ?? undefined}
              />
            </div>
            <Footbar editor={editor} />
          </Splitter.Panel>
        </Splitter>
      </div>
    </ThemeBridge>
  );
};

export default App;
