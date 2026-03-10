import React, { useRef } from "react";

type PickerMode = "file" | "directory";

interface DirectoryInputElement extends HTMLInputElement {
  webkitdirectory: boolean;
  directory: boolean;
}
export const useFilePicker = (onFilesSelected: (files: File[]) => void) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const openPicker = (mode: PickerMode = "file") => {
    if (inputRef.current) {
      const input = inputRef.current as DirectoryInputElement;
      if (mode === "directory") {
        input.webkitdirectory = true;
        input.directory = true;
      } else {
        input.webkitdirectory = false;
        input.directory = false;
      }
      inputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
      e.target.value = "";
    }
  };

  return {
    Picker: (
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".md"
      />
    ),
    openPicker,
  };
};
