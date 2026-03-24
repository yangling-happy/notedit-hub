import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload extends jwt.JwtPayload {
  userId: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
}
export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return res.status(403).json({ message: "Token invalid" });
    }

    if (!decoded.userId || !decoded.username) {
      return res.status(403).json({ message: "Token invalid" });
    }

    req.user = decoded as AuthPayload;

    next();
  } catch (_) {
    return res.status(403).json({ message: "Token invalid" });
  }
};
