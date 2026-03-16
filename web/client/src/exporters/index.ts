export const EXPORT_PROCESSORS = {
  "7-1": () => import("./docx").then((m) => m.exportToDocx),
  "7-2": () => import("./pdf").then((m) => m.exportToPdf),
  "7-3": () => import("./markdown").then((m) => m.exportToMarkdown),
};