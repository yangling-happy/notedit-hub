import express from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { auth } from "../middleware/auth.js";
import { uploadImage } from "../controllers/uploadController.js";

const router: express.Router = express.Router();
const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname) || ".bin";
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${base}-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("仅支持上传图片文件"));
      return;
    }
    cb(null, true);
  },
});

router.use(auth);
router.post("/images", upload.single("file"), uploadImage);

export default router;
