// import React from "react";

import { useCreateBlockNote } from "@blocknote/react";
// Or, you can use ariakit, shadcn, etc.
import { BlockNoteView } from "@blocknote/mantine";
// Default styles for the mantine editor
import "@blocknote/mantine/style.css";
// Include the included Inter font
import "@blocknote/core/fonts/inter.css";

export default function Editor() {
  // Create a new editor instance
  const editor = useCreateBlockNote();

  // Render the editor
  return <BlockNoteView editor={editor} />;
}