import React from "react";

import { FolderOutlined, CaretDownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space, Modal } from "antd";
import useFileExport from "../../../hooks/useFileExport";
import type { BlockNoteEditor } from "@blocknote/core";
import { clearEditor } from "../../../utils/clearEditor";
import { useFileImport } from "../../../hooks/useFileImport";
import { useFilePicker } from "../../../hooks/useFilePicker";
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
        label: "Markdown",
      },
    ],
  },
];
const File: React.FC<{ editor: BlockNoteEditor }> = ({ editor }) => {
  const { exportFile } = useFileExport(editor);
  const { importFile } = useFileImport(editor);
  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      // 如果你想支持多选文件夹，这里循环调用 importFile
      files.forEach(file => importFile(file)); 
    }
  };
  const { Picker, openPicker } = useFilePicker(handleFilesSelected);
  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith("7-")) {
      exportFile(key);
    }
    if (key === "1") {
      Modal.confirm({
        title: "新建文档会清空当前编辑，请确认您已导出或已有备份，是否继续？",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          clearEditor(editor);
        },
      });
    }
    if (key === "2") {
      window.open(window.location.origin, "_blank");
    }
    if(key === "3-1") {
      openPicker("directory");
    }
    if (key === "6") {
      openPicker("file");
    }
  };

  return (
    <>
      {Picker}
      <Dropdown menu={{ items, onClick: onMenuClick }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <FolderOutlined />
            文件
            <CaretDownOutlined />
          </Space>
        </a>
      </Dropdown>
    </>
  );
};

export default File;
