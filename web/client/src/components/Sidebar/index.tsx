import React ,{useState}from "react";
import { Segmented } from "antd";
import {FileList} from "./fileList";
import {Outline} from "./outLine";


const Sidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState("文件");
    return (
      <div >
        <div >
          <Segmented
            options={["文件", "大纲"]}
            block
            value={activeTab}
            onChange={(value) => setActiveTab(value as string)}
          />
        </div>
        <div className="sidebar-scrollable">
          {activeTab === "文件" ? <FileList /> : <Outline />}
        </div>
      </div>
    )
};

export default Sidebar;
