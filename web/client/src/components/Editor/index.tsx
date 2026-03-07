// import React from "react";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

export default function Editor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor}/>;
}