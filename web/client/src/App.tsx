import React from "react";
import { Splitter } from "antd";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { Toolbar } from "./components/Toolbar";
import { Footbar } from "./components/Footbar";
import "./styles/global.css";
import { useCreateBlockNote } from "@blocknote/react";
import { en, zh } from "@blocknote/core/locales";
import { useEditorStorage } from "./hooks/useEditorStorage";
import { useEffect, useState } from "react";
import { ThemeBridge } from "./components/themeBridge";
import { useTranslation } from "react-i18next";
import "./locales/i18.ts";
const App: React.FC = () => {
  // 以后换成自己的云存储，临时文件1小时后会过期
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
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  useEffect(() => {
    const handleLangChange = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handleLangChange);
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18n]);
  const editor = useCreateBlockNote({
    dictionary: lang === "zh" ? zh : en,
    uploadFile,
  });
  // console.log("当前 App 中的 lang 状态:", lang);
  editor.focus();
  const docId = "default-note-id";
  const { data, isLoading, save } = useEditorStorage(docId);

  useEffect(() => {
    if (editor && data && !isLoading) {
      editor.replaceBlocks(editor.document, data.content);
    }
  }, [editor, data, isLoading]);
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
              <Editor key={lang} editor={editor} onSave={save} noteId={docId} />
            </div>
            <Footbar editor={editor} />
          </Splitter.Panel>
        </Splitter>
      </div>
    </ThemeBridge>
  );
};
export default App;
