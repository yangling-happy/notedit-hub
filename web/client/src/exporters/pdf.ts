export const exportToPdf = async (editor: any): Promise<Blob> => {
  const [{ PDFExporter, pdfDefaultSchemaMappings }, { default: ReactPDF }] =
    await Promise.all([
      import("@blocknote/xl-pdf-exporter"),
      import("@react-pdf/renderer"),
    ]);
  const exporter = new PDFExporter(
    editor.schema,
    pdfDefaultSchemaMappings as any,
  );
  const pdfDocument = await exporter.toReactPDFDocument(editor.document);
  const blob = await ReactPDF.pdf(pdfDocument).toBlob();

  return blob;
};
