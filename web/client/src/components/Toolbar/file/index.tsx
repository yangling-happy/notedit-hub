import React from "react";
import { FolderOutlined, CaretDownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space, Modal } from "antd";
import { useTranslation } from "react-i18next";
import useFileExport from "../../../hooks/useFileExport";
import type { BlockNoteEditor } from "@blocknote/core";
import { clearEditor } from "../../../utils/clearEditor";
import { useFileImport } from "../../../hooks/useFileImport";
import { useFilePicker } from "../../../hooks/useFilePicker";

const File: React.FC<{ editor: BlockNoteEditor }> = ({ editor }) => {
  const { t } = useTranslation();
  const { exportFile } = useFileExport(editor);
  const { importFile } = useFileImport(editor);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      files.forEach((file) => importFile(file));
    }
  };

  const { Picker, openPicker } = useFilePicker(handleFilesSelected);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: t("toolbar.new"),
    },
    {
      key: "2",
      label: t("toolbar.new_window"),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: t("toolbar.open"),
      children: [
        {
          key: "3-1",
          label: t("toolbar.open_folder"),
        },
        {
          key: "3-2",
          label: t("toolbar.recent"),
        },
      ],
    },
    {
      type: "divider",
    },
    {
      key: "6",
      label: t("toolbar.import"),
    },
    {
      key: "7",
      label: t("toolbar.export"),
      children: [
        {
          key: "7-1",
          label: t("toolbar.export_docx"),
        },
        {
          key: "7-2",
          label: t("toolbar.export_pdf"),
        },
        {
          key: "7-3",
          label: t("toolbar.export_markdown"),
        },
      ],
    },
  ];

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith("7-")) {
      exportFile(key);
    }
    if (key === "1") {
      Modal.confirm({
        title: t("modal.new_document_confirm"),
        okText: t("modal.confirm"),
        cancelText: t("modal.cancel"),
        onOk: () => {
          clearEditor(editor);
        },
      });
    }
    if (key === "2") {
      window.open(window.location.origin, "_blank");
    }
    if (key === "3-1") {
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
            {t("toolbar.file")}
            <CaretDownOutlined />
          </Space>
        </a>
      </Dropdown>
    </>
  );
};

export default File;
