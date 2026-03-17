// web/src/services/api.ts

const API_BASE_URL = "http://localhost:3001/api";

/**
 * 创建新文档
 * @param title 文档标题
 * @param content BlockNote 的初始内容数组
 */
export const createDocument = async (title: string, content: any[] = []) => {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json(); // 返回后端生成的 doc 对象（包含 _id）
};

/**
 * 获取单个文档详情
 * @param id 文档的 MongoDB _id
 */
export const getDocumentById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`);
  if (!response.ok) throw new Error("获取文档失败");
  return await response.json();
};