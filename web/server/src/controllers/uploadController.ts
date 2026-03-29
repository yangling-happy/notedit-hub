import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import UploadAsset from "../models/uploadAsset.js";

const getForwardedProto = (req: AuthRequest) => {
  const raw = req.headers["x-forwarded-proto"];
  if (typeof raw !== "string") {
    return undefined;
  }

  const [proto] = raw.split(",");
  return proto?.trim();
};

export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.sendStatus(401);
    }

    if (!req.file) {
      return res.status(400).json({ message: "请选择要上传的图片" });
    }

    const host = req.get("host");
    if (!host) {
      return res.status(500).json({ message: "无法生成文件访问地址" });
    }

    const protocol = getForwardedProto(req) ?? req.protocol;
    const url = `${protocol}://${host}/uploads/${req.file.filename}`;

    const upload = await UploadAsset.create({
      owner: userId,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url,
    });

    return res.status(201).json({
      uploadId: upload._id,
      url: upload.url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "图片上传失败" });
  }
};
