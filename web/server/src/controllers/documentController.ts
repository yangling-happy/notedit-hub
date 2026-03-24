import Document from "../models/document.js";
import type { AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const getUserId = (req: AuthRequest) => req.user?.userId;
const getDocId = (req: AuthRequest) => {
  const rawId = req.params?.id;
  return typeof rawId === "string" ? rawId : undefined;
};

export const createDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.sendStatus(401);

    const { title, content } = req.body;
    const newDoc = await Document.create({ title, content, owner: userId });
    res.status(201).json(newDoc);
  } catch (_) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};

export const getAllDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.sendStatus(401);

    const docs = await Document.find(
      { owner: userId },
      "title _id updatedAt createdAt",
    ).sort({ updatedAt: -1 });

    res.json(docs);
  } catch (_) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.sendStatus(401);
    const docId = getDocId(req);
    if (!docId) return res.status(400).json({ message: "文档ID不合法" });

    const doc = await Document.findOne({ _id: docId, owner: userId });
    if (!doc) return res.status(404).json({ message: "文档不存在" });

    res.json(doc);
  } catch (_) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};

export const updateDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.sendStatus(401);
    const docId = getDocId(req);
    if (!docId) return res.status(400).json({ message: "文档ID不合法" });

    const { title, content } = req.body;
    const doc = await Document.findOneAndUpdate(
      { _id: docId, owner: userId },
      {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
      { new: true },
    );

    if (!doc) return res.status(404).json({ message: "文档不存在" });

    res.json(doc);
  } catch (_) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.sendStatus(401);
    const docId = getDocId(req);
    if (!docId) return res.status(400).json({ message: "文档ID不合法" });

    const deletedDoc = await Document.findOneAndDelete({
      _id: docId,
      owner: userId,
    });

    if (!deletedDoc) return res.status(404).json({ message: "文档不存在" });

    res.json({ message: "删除成功" });
  } catch (_) {
    res.status(500).json({ message: "服务器内部错误" });
  }
};
