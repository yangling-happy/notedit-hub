import React from "react";

import { Splitter } from "antd";
import { Sidebar } from "./components/Sidebar";
import Editor from "./components/Editor";
import { Toolbar } from "./components/Toolbar";
import "./styles/global.css";

const App: React.FC = () => (
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
          <Sidebar />
        </div>
      </Splitter.Panel>
      <Splitter.Panel
        className="main-content"
        collapsible={{ showCollapsibleIcon: false }}
        min="20%"
        defaultSize="80%"
      >
        <div
          className="main-content-scrollable"
          style={{ padding: "15px 20px" }}
        >
          <Editor />
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
);

export default App;
