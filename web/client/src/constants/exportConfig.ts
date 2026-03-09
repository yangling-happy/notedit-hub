export interface ExportFormat {
  label: string;
  ext: string;
  mime: string;
}

export const EXPORT_CONFIG: Record<string, ExportFormat> = {
  "7-1": {
    label: "DOCX",
    ext: ".docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  "7-2": {
    label: "PDF",
    ext: ".pdf",
    mime: "application/pdf",
  },
  "7-3": {
    label: "Markdown",
    ext: ".md",
    mime: "text/markdown",
  },
};
