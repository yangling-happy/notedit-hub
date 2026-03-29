import Document from "../models/document.js";
import DocumentMember from "../models/documentMember.js";
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

    const memberRows = await DocumentMember.find({ userId }, "documentId");
    const docs = await Document.find(
      {
        $or: [
          { owner: userId },
          { _id: { $in: memberRows.map((m) => m.documentId) } },
        ],
      },
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
    const isOwner = await Document.exists({ _id: docId, owner: userId });
    const isMember = await DocumentMember.exists({ documentId: docId, userId });
    if (!isOwner && !isMember) {
      return res.status(404).json({ message: "文档不存在" });
    }

    const doc = await Document.findById(docId);
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

    const isOwner = await Document.exists({ _id: docId, owner: userId });
    const isMember = await DocumentMember.exists({ documentId: docId, userId });

    if (!isOwner && !isMember) {
      return res.status(404).json({ message: "文档不存在或无权限" });
    }

    const { title, content } = req.body;
    const doc = await Document.findByIdAndUpdate(
      docId,
      {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
      { new: true },
    );

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

export const createShareLink = async (req: AuthRequest, res: Response) => {
  try {
    // 1. 取 userId（无则 401）
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }

    // 2. 取 docId（无则 400）
    const { id: docId } = req.params;
    if (!docId) {
      return res.status(400).json({ error: "Bad Request: docId is required" });
    }

    // 3. 查文档是否存在且 owner=userId
    const document = await Document.findOne({
      _id: docId,
      owner: userId,
    });

    if (!document) {
      // 文档不存在或不属于当前用户
      return res
        .status(404)
        .json({ error: "Document not found or you are not the owner" });
    }

    // 4. 拼接链接
    const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
    const shareUrl = `${clientOrigin}/wiki/${docId}?join=1`;

    // 5. 返回 shareUrl
    return res.status(200).json({ shareUrl });
  } catch (error) {
    console.error("Error creating share link:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const createDocumentMember = async (req: AuthRequest, res: Response) => {
  try {
    // 1. 取 userId（无则 401）
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }

    // 2. 取 docId（无则 400）
    const { id: docId } = req.params;
    if (!docId) {
      return res.status(400).json({ error: "Bad Request: docId is required" });
    }

    // 3. 查文档是否存在（不存在 404）
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // 4. 若当前就是 owner，直接返回“已是所有者”
    if (document.owner.toString() === userId) {
      return res.status(200).json({
        message: "You are already the owner of this document",
        isOwner: true,
      });
    }

    // 5. 对 DocumentMember 做 upsert
    await DocumentMember.findOneAndUpdate(
      { documentId: docId, userId: userId },
      {
        documentId: docId,
        userId: userId,
        role: "editor",
        joinedAt: new Date(),
      },
      {
        upsert: true, // 不存在则创建
        new: true, // 返回更新后的文档
        setDefaultsOnInsert: true, // 插入时设置默认值
      },
    );

    // 6. 返回成功（幂等）
    return res.status(200).json({
      message: "Successfully joined the document",
      documentId: docId,
      role: "editor",
    });
  } catch (error) {
    console.error("Error creating document member:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
