import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import type { AuthRequest } from "../middleware/auth.js";

const buildAuthPayload = (user: { _id: unknown; username: string }) => {
  const token = jwt.sign(
    { userId: String(user._id), username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" },
  );

  return {
    token,
    user: {
      id: String(user._id),
      username: user.username,
    },
  };
};

// 登录处理
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // 1. 验证必填字段
  if (!username || !password) {
    return res.status(400).json({ message: "用户名和密码不能为空" });
  }

  // 2. 查找用户
  // 注意：password 字段在 schema 中设置了 select: false，需要显式获取
  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "用户名或密码错误" });
  }

  // 3. 比对密码
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "用户名或密码错误" });
  }

  // 4. 返回给前端
  res.json(buildAuthPayload(user));
};

// 注册处理
export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body ?? {};

  // 1. 验证必填字段
  if (!username || !password) {
    return res.status(400).json({ message: "用户名和密码不能为空" });
  }

  // 2. 验证密码长度
  if (password.length < 6) {
    return res.status(400).json({ message: "密码至少 6 个字符" });
  }

  try {
    // 3. 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "用户名已存在" });
    }

    // 4. 创建用户（密码会自动在 pre('save') 钩子中加密）
    const user = await User.create({
      username,
      password,
    });

    // 5. 返回成功响应
    res.status(201).json({
      message: "注册成功",
      ...buildAuthPayload(user),
    });
  } catch (error) {
    // 7. 处理验证错误
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "服务器错误" });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.sendStatus(401);
    }

    const user = await User.findById(userId).select("_id username");
    if (!user) {
      return res.sendStatus(401);
    }

    return res.json({
      user: {
        id: String(user._id),
        username: user.username,
      },
    });
  } catch (_) {
    return res.status(500).json({ message: "服务器错误" });
  }
};
