import express from 'express';
import { createDocument } from '../controllers/documentController.js';

const router : express.Router = express.Router();

// 将 POST 请求映射到刚才写的函数上
router.post('/', createDocument);

export default router;