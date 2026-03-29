import express from "express";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  createShareLink,
  createDocumentMember,
} from "../controllers/documentController.js";
import { handleAIChat } from "../controllers/aiController.js";
import { auth } from "../middleware/auth.js";

const router: express.Router = express.Router();
router.use(auth);
router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.post("/", createDocument);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);
router.post("/chat", handleAIChat);
router.post("/:id/share-link", createShareLink);
router.post("/:id/join", createDocumentMember);
export default router;
