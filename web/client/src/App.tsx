import React from "react";
import { Splitter } from "antd";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { Toolbar } from "./components/Toolbar";
import "./styles/global.css";
import { useCreateBlockNote } from "@blocknote/react";
import { zh } from "@blocknote/core/locales";
const App: React.FC = () => {
  const editor = useCreateBlockNote({ dictionary: zh });
  return (
    <div className="fixed-viewport">
      <Toolbar />
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
            <Editor editor={editor} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
export default App;
