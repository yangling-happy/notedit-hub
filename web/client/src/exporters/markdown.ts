export const exportToMarkdown = async (editor: any): Promise<Blob> => {
  const md = await editor.blocksToMarkdownLossy(editor.document);
  return new Blob([md], { type: "text/markdown" });
};