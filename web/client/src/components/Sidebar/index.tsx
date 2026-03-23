import React, { useState } from "react";
import { Segmented } from "antd";
import { WikiList } from "./wikiList";
import { Outline } from "./outLine";
import { useTranslation } from "react-i18next";
import { useEditor } from "../../contexts/editorContext";

const Sidebar: React.FC = () => {
  const editor = useEditor();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "wiki",
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div>
        <Segmented
          options={[
            { label: t("sidebar.wiki"), value: "wiki" },
            { label: t("sidebar.outline"), value: "outline" },
          ]}
          block
          value={activeTab}
          onChange={(value) => {
            setActiveTab(value as string);
            localStorage.setItem("activeTab", value as string);
          }}
        />
      </div>
      <div className="sidebar-scrollable">
        {activeTab === "wiki" ? <WikiList /> : <Outline editor={editor} />}
      </div>
    </div>
  );
};

export default Sidebar;
