import React from "react";

import { FolderOutlined, CaretDownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

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
    type: 'divider',
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
    type: 'divider',
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
    type: 'divider',
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
        label: "Markdown",
      },
      {
        key: "7-2",
        label: "Word",
      },
      {
        key: "7-3",
        label: "PDF",
      },
    ],
  },
];

const File: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        <FolderOutlined />
        文件
        <CaretDownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default File;
