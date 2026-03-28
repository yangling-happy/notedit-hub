import { EXPORT_PROCESSORS } from "../exporters";
import { EXPORT_CONFIG } from "../constants/exportConfig";
import { fileExport } from "../utils/fileExport";
import { useTranslation } from "react-i18next";

interface BlockContent {
  text?: string;
}

interface Block {
  content?: BlockContent[];
}

const formatFileName = (document: Block[], untitled: string): string => {
  if (!document || document.length === 0) {
    return untitled;
  }
  const firstBlock = document[0];
  const rawText = firstBlock?.content?.[0]?.text || untitled;
  const sanitized = rawText.replace(/[\\/:*?"<>|]/g, "_");
  return sanitized;
};

const useFileExport = (editor: any) => {
  const { t } = useTranslation();

  const exportFile = async (key: string) => {
    const getProcessor =
      EXPORT_PROCESSORS[key as keyof typeof EXPORT_PROCESSORS];
    const config = EXPORT_CONFIG[key as keyof typeof EXPORT_CONFIG];

    if (!getProcessor || !config) {
      console.error(t("error.export_processor_not_found", { key }));
      return;
    }

    try {
      const actualProcessor = await getProcessor();

      const blob = await actualProcessor(editor);

      const ext = config.ext;
      const fileName = `${formatFileName(editor.document, t("filelist.untitled"))}${ext}`;
      fileExport(blob, fileName);
    } catch (error) {
      console.error(t("error.export_failed"), error);
    }
  };

  return { exportFile };
};
export default useFileExport;
