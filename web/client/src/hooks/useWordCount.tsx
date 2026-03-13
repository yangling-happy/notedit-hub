import type { Block } from "@blocknote/core";
import { useState, useEffect } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { debounce } from "lodash";
const countWordsInBlocks = (blocks: Block[]): number => {
  let count = 0;

  for (const block of blocks) {
    if (block.content && Array.isArray(block.content)) {
      block.content.forEach((node: any) => {
        if (node.type === "text" && node.text) {
         count += node.text.trim().length;
        }
      });
    }
    if (block.children && block.children.length > 0) {
      count += countWordsInBlocks(block.children);
    }
  }
  return count;
};

export const useWordCount = (editor: BlockNoteEditor | undefined) => {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const updateCount = debounce(() => {
      const count = countWordsInBlocks(editor.document);
      setWordCount(count);
    }, 300);

    const unsub = editor.onChange(updateCount);

    updateCount();

    return () => {
      unsub();
      updateCount.cancel(); 
    };
  }, [editor]);

  return wordCount;
};
