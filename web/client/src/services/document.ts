import apiClient from "./client";

/**
 * 创建新文档
 */
export const createDocument = async (title: string, content: any[] = []) => {
  const response = await apiClient.post("/api/documents", { title, content });
  return response.data;
};

/**
 * 获取所有文档列表（只含 title、_id、updatedAt）
 */
export const getAllDocuments = async () => {
  const response = await apiClient.get("/api/documents");
  return response.data;
};

/**
 * 获取单个文档详情
 */
export const getDocumentById = async (id: string) => {
  const response = await apiClient.get(`/api/documents/${id}`);
  return response.data;
};

/**
 * 更新文档内容
 */
export const updateDocument = async (
  id: string,
  data: { title?: string; content?: any[] },
) => {
  const response = await apiClient.put(`/api/documents/${id}`, data);
  return response.data;
};

/**
 * 删除文档
 */
export const deleteDocument = async (id: string) => {
  const response = await apiClient.delete(`/api/documents/${id}`);
  return response.data;
};

export const createShareLink = async (id: string) => {
  const response = await apiClient.post(`/api/documents/${id}/share-link`);
  return response.data;
};

export const joinDocument = async (id: string) => {
  const response = await apiClient.post(`/api/documents/${id}/join`);
  return response.data;
};
