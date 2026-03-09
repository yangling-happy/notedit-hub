import {
  PDFExporter,
  pdfDefaultSchemaMappings,
} from "@blocknote/xl-pdf-exporter";
import * as ReactPDF from "@react-pdf/renderer";

export const exportToPdf = async (editor: any): Promise<Blob> => {
  const exporter = new PDFExporter(
    editor.schema,
    pdfDefaultSchemaMappings as any,
  );
  const pdfDocument = await exporter.toReactPDFDocument(editor.document);
  const blob = await ReactPDF.pdf(pdfDocument).toBlob();

  return blob;
};
