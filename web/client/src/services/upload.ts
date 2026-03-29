import apiClient from "./client";

export const uploadImage = async (file: File) => {
  const body = new FormData();
  body.append("file", file);

  const response = await apiClient.post("/api/uploads/images", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const url = response.data?.url;
  if (typeof url !== "string" || !url) {
    throw new Error("图片上传成功但未返回有效 URL");
  }

  return url;
};
