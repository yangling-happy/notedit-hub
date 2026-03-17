import Document from '../models/document.js';

export const createDocument = async (req: any, res: any) => {
  try {
    // 1. 从请求体拿数据
    const { title, content } = req.body;
    // 2. 存入数据库
    const newDoc = await Document.create({ title, content });
    // 3. 返回结果
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};