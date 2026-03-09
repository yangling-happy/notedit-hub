import { fileExport } from "../utils/fileExport";

interface BlockContent {
  text?: string;
}

interface Block {
  content?: BlockContent[];
}

const formatFileName = (document: Block[]): string => {
  const firstBlock = document[0];
  const rawText = firstBlock?.content?.[0]?.text || "无标题";
  const sanitized = rawText.replace(/[\\/:*?"<>|]/g, "_");
  return `${sanitized}.md`;
};

const useFileExport = (editor: any) => {
  const exportMarkdown = async (): Promise<void> => {
    try {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);
      const fileName = formatFileName(editor.document);
      fileExport(markdown, fileName);
    } catch (error) {
      console.error("导出失败:", error);
      throw error;
    }
  };

  return { exportMarkdown };
};

export default useFileExport;
