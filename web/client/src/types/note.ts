import { type Block } from "@blocknote/core";
export interface Note {
  id: string;
  content: Block[];
  updatedAt: number;
}
