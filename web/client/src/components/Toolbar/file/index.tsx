import React from "react";

import { FolderOutlined, CaretDownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import useFileExport from "../../../hooks/useFileExport";
import type { BlockNoteEditor } from "@blocknote/core";


const items: MenuProps["items"] = [
  {
    key: "1",
    label: "新建",
  },
  {
    key: "2",
    label: "新建窗口",
  },
  {
    type: "divider",
  },
  {
    key: "3",
    label: "打开",
    children: [
      {
        key: "3-1",
        label: "打开文件夹",
      },
      {
        key: "3-2",
        label: "最近打开",
      },
    ],
  },
  {
    type: "divider",
  },
  {
    key: "4",
    label: "保存",
  },
  {
    key: "5",
    label: "另存为",
  },
  {
    type: "divider",
  },
  {
    key: "6",
    label: "导入",
  },
  {
    key: "7",
    label: "导出",
    children: [
      {
        key: "7-1",
        label: "DOCX",
      },
      {
        key: "7-2",
        label: "PDF",
      },
      {
        key: "7-3",
        label: "ODT",
      },
      {
        key: "7-4",
        label: "Email Export",
      },
      {
        key: "7-5",
        label: "Markdown",
      },
    ],
  },
];
const File: React.FC<{ editor: BlockNoteEditor }> = ({ editor }) => {
  const { exportMarkdown } = useFileExport(editor); 

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "7-5") {
      exportMarkdown();
    }
    // 其他 key 的事件处理可以在这里添加
  };

  return (
    <Dropdown menu={{ items, onClick: onMenuClick }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <FolderOutlined />
          文件
          <CaretDownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default File;
