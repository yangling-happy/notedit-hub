import  { exportToMarkdown } from "./markdown";
import { exportToPdf } from "./pdf";
import { exportToDocx } from "./docx";

export const EXPORT_PROCESSORS = {
  "7-1": exportToDocx,
  "7-2": exportToPdf,
  "7-3": exportToMarkdown,
};