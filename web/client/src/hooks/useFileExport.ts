import { EXPORT_PROCESSORS } from "../exporters";
import { EXPORT_CONFIG } from "../constants/exportConfig";
import { fileExport } from "../utils/fileExport";

interface BlockContent {
  text?: string;
}

interface Block {
  content?: BlockContent[];
}

const formatFileName = (document: Block[]): string => {
  if (!document || document.length === 0) {
    return "无标题";
  }
  const firstBlock = document[0];
  const rawText = firstBlock?.content?.[0]?.text || "无标题";
  const sanitized = rawText.replace(/[\\/:*?"<>|]/g, "_");
  return sanitized;
};

const useFileExport = (editor: any) => {
  const exportFile = async (key: string) => {
    const getProcessor =
      EXPORT_PROCESSORS[key as keyof typeof EXPORT_PROCESSORS];
    const config = EXPORT_CONFIG[key as keyof typeof EXPORT_CONFIG];

    if (!getProcessor || !config) {
      console.error(`未找到对应的导出处理器，Key: ${key}`);
      return;
    }

    try {
      const actualProcessor = await getProcessor();

      const blob = await actualProcessor(editor);

      const ext = config.ext;
      const fileName = `${formatFileName(editor.document)}${ext}`;
      fileExport(blob, fileName);
    } catch (error) {
      console.error("文件导出失败:", error);
    }
  };

  return { exportFile };
};
export default useFileExport;
