import { useCallback } from "react";
import { uploadImage } from "../services/upload";

export const useImageUpload = () => {
  const uploadFile = useCallback(async (file: File) => {
    return uploadImage(file);
  }, []);

  return { uploadFile };
};
