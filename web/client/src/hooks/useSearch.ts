import { BlockNoteEditor } from "@blocknote/core";
import { useEffect, useState } from "react";
import type { Block } from "@blocknote/core";
type Segment = {
  start: number;
  end: number;
  blockId: string;
};

export const useSearch = (editor: BlockNoteEditor | undefined) => {
  const [fullText, setFullText] = useState("");
  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    if (!editor) return;

    const unsub = editor.onChange(() => {
      let currentText = "";
      const currentSegments: Segment[] = [];

      const processBlocks = (blocks: Block[]) => {
        for (const block of blocks) {
          const start = currentText.length;

          let blockContentText = "";
          if (Array.isArray(block.content)) {
            block.content.forEach((node: any) => {
              if (node.type === "text") blockContentText += node.text;
            });
          }

          currentText += blockContentText + "\n";
          const end = currentText.length;
          currentSegments.push({
            start,
            end,
            blockId: block.id,
          });

          if (block.children) processBlocks(block.children);
        }
      };

      processBlocks(editor.document);

      setFullText(currentText);
      setSegments(currentSegments);
    });

    return () => unsub();
  }, [editor]);
  const executeSearch = (keyword: string) => {
    if (!keyword.trim()) return [];
    const regex = new RegExp(keyword, "gi");
    const matches = Array.from(fullText.matchAll(regex));

    return matches
      .map((match) => {
        const index = match.index!;
        const target = segments.find((s) => index >= s.start && index < s.end);
        return {
          text: match[0],
          index,
          blockId: target?.blockId,
        };
      })
      .filter((item) => item.blockId); 
  };
  return { fullText, segments, executeSearch };
};
