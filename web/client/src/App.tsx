import React from "react";

import { Splitter } from "antd";
import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";
import { Toolbar } from "./components/Toolbar";

const App: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    <Toolbar />
    <Splitter style={{ flex: 1 }}>
      <Splitter.Panel collapsible ={{start: true, end: true, showCollapsibleIcon: true}} min="20%" defaultSize="30%">
        <Sidebar />
      </Splitter.Panel>
      <Splitter.Panel>
        <Editor />
      </Splitter.Panel>
    </Splitter>
  </div>
);

export default App;
