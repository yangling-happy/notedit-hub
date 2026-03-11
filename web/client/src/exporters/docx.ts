export const exportToDocx = async (editor: any): Promise<Blob> => {
  const [{ DOCXExporter, docxDefaultSchemaMappings }, { Packer }] =
    await Promise.all([import("@blocknote/xl-docx-exporter"), import("docx")]);
  const exporter = new DOCXExporter(
    editor.schema,
    docxDefaultSchemaMappings as any,
  );
  const docxDocument = await exporter.toDocxJsDocument(editor.document);

  const bolb = await Packer.toBlob(docxDocument);
  return bolb;
};
