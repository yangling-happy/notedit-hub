import type { Block } from "@blocknote/core";
export const extractTitle = (blocks: Block[]): string => {
  // 1. 寻找第一个 heading，如果没有，则取第一个 paragraph
  const targetBlock = blocks.find(
    (b) =>
      (b.type === "heading" || b.type === "paragraph") &&
      Array.isArray(b.content) &&
      b.content.length > 0,
  );

  if (!targetBlock) return "";

  // 2. 这里的 item 类型是 StyledText，内容在 .text 属性里
  return (targetBlock.content as any[])
    .map((item) => item.text || "")
    .join("")
    .trim();
};
