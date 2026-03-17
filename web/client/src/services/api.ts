// web/src/services/api.ts

const API_BASE_URL = "http://localhost:3001/api";

/**
 * 创建新文档
 */
export const createDocument = async (title: string, content: any[] = []) => {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};

/**
 * 获取所有文档列表（只含 title、_id、updatedAt）
 */
export const getAllDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents`);
  if (!response.ok) throw new Error("获取文档列表失败");
  return await response.json();
};

/**
 * 获取单个文档详情
 */
export const getDocumentById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`);
  if (!response.ok) throw new Error("获取文档失败");
  return await response.json();
};

/**
 * 更新文档内容
 */
export const updateDocument = async (
  id: string,
  data: { title?: string; content?: any[] },
) => {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("更新文档失败");
  return await response.json();
};
