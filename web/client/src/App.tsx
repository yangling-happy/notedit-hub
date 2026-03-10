import React from "react";
import { Splitter } from "antd";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { Toolbar } from "./components/Toolbar";
import "./styles/global.css";
import { useCreateBlockNote } from "@blocknote/react";
import { zh } from "@blocknote/core/locales";
import { useEditorStorage } from "./hooks/useEditorStorage";
import { useEffect } from "react";
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
  const editor = useCreateBlockNote({ dictionary: zh, uploadFile });
  editor.focus();
  const docId = "default-note-id";
  const { data, isLoading, save } = useEditorStorage(docId);
  useEffect(() => {
    if (editor && data && !isLoading) {
      editor.replaceBlocks(editor.document, data.content);
    }
  }, [editor, data, isLoading]);
  return (
    <div className="fixed-viewport">
      <Toolbar editor={editor}/>
      <Splitter
        style={{ flex: 1, height: "calc(100% - 48px)", overflow: "hidden" }}
      >
        <Splitter.Panel
          className="sidebar-container sidebar-trigger"
          style={{ overflow: "hidden" }}
        >
          <div className="sidebar-hidden sidebar-scrollable">
            <Sidebar editor={editor} />
          </div>
        </Splitter.Panel>
        <Splitter.Panel className="main-content" min="20%" defaultSize="80%">
          <div
            className="main-content-scrollable"
            style={{ padding: "15px 20px" }}
          >
            <Editor editor={editor} onSave={save} noteId={docId} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
export default App;
