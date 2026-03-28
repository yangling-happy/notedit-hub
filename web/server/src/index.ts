import "dotenv/config";
import express from "express";
import expressWs from "express-ws";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import documentRoutes from "./routes/documentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import http from "http";
import { createWebSocketHandler } from "./collaboration/index.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// 1. 初始化 express-ws
const { app: wsApp } = expressWs(app, server);

// 2. 中间件配置
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["x-vercel-ai-data-stream"],
  }),
);

app.use(express.json());

// 3. 初始化协作服务
const wsHandler = createWebSocketHandler();
wsHandler.setup(server, wsApp);

// 4. 日志中间件
app.use((req, res, next) => {
  console.log(`📡 [Incoming] ${req.method} ${req.url}`);
  next();
});

// 5. 路由挂载
app.use("/api/documents", documentRoutes);
app.use("/api/auth", authRoutes);

// 6. 健康检查
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// 7. 数据库连接
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 8. 启动监听
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
