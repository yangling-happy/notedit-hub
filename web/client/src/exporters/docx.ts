import {
  DOCXExporter,
  docxDefaultSchemaMappings,
} from "@blocknote/xl-docx-exporter";
import { Packer } from "docx";
export const exportToDocx = async (editor: any): Promise<Blob> => {
  const exporter = new DOCXExporter(
    editor.schema,
    docxDefaultSchemaMappings as any,
  );
  const docxDocument = await exporter.toDocxJsDocument(editor.document);

  const bolb = await Packer.toBlob(docxDocument);
  return bolb;
};
