import { useState, useEffect } from "react";
import { type Block } from "@blocknote/core";
type HeadingBlock = Block & { type: "heading" };

export const useOutline = (editor: any) => {
  const [outline, setOutline] = useState<HeadingBlock[]>([]);

  useEffect(() => {
    if (!editor) return;

    const updateOutline = () => {
      const headings = editor.topLevelBlocks.filter(
        (block: Block): block is HeadingBlock => block.type === "heading"
      );
      setOutline(headings);
    };

    updateOutline();
    const removeListener = editor.onChange(updateOutline);
    return () => removeListener?.();
  }, [editor]);

  return outline;
};