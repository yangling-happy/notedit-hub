import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Document from "../models/document.js";
import DocumentMember from "../models/documentMember.js";

export interface CollaborationUser {
  userId: string;
  username: string;
}

const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET 未配置");
  }
  return secret;
};

export const verifyCollaborationToken = (token: string): CollaborationUser => {
  if (!token) {
    throw new Error("未提供协作认证令牌");
  }

  const decoded = jwt.verify(token, getJWTSecret());
  if (typeof decoded === "string") {
    throw new Error("协作认证失败");
  }

  const userId = decoded.userId;
  const username = decoded.username;

  if (!userId || !username) {
    throw new Error("协作认证令牌无效");
  }

  return {
    userId: String(userId),
    username: String(username),
  };
};

export const canAccessDocument = async (
  documentId: string,
  userId: string,
): Promise<boolean> => {
  if (
    !mongoose.Types.ObjectId.isValid(documentId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return false;
  }

  const isOwner = await Document.exists({ _id: documentId, owner: userId });
  if (isOwner) return true;

  const isMember = await DocumentMember.exists({ documentId, userId });
  return Boolean(isMember);
};
