import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import documentRoutes from "./routes/documentRoutes.js";
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 1. 中间件配置 (必须在前)
app.use(cors({
  origin: "http://localhost:5173", // 确保匹配你前端 Vite 的端口
  credentials: true,
  exposedHeaders: ["x-vercel-ai-data-stream"]
}));

app.use(express.json());

// 2. 【新增】全路径日志雷达：如果这个没打印，说明前端没发对地址
app.use((req, res, next) => {
  console.log(`📡 [Incoming] ${req.method} ${req.url}`);
  next();
});

// 3. 路由挂载 (必须在 listen 之前！)
app.use("/api/documents", documentRoutes);
app.use('/api/auth', authRoutes);

// 4. 健康检查
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// 5. 数据库连接
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 6. 最后启动监听
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});