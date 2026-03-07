// import React from "react";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { zh } from "@blocknote/core/locales";
  
export default function Editor() {
  const editor = useCreateBlockNote({ dictionary: zh,});
  return <BlockNoteView editor={editor}/>;
}