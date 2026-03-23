import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { BlockNoteEditor } from "@blocknote/core";

interface EditorContextType {
  editor: BlockNoteEditor | null;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
  editor: BlockNoteEditor | null;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  editor,
}) => {
  return (
    <EditorContext.Provider value={{ editor }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): BlockNoteEditor => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  if (!context.editor) {
    throw new Error("Editor is not initialized");
  }
  return context.editor;
};
