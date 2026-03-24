import React, { createContext, useEffect, useState } from "react";
import { meApi } from "../services/auth";

export interface AuthUser {
  id: string;
  username: string;
}

export interface AuthContextType {
  // 1. 核心状态：当前用户是谁？
  user: AuthUser | null;

  // 2. 状态：是否正在初始化（从 LocalStorage 加载中）？
  // 提示：这能防止页面在检查 Token 时闪现“未登录”状态
  isLoading: boolean;

  // 3. 方法：登录成功后调用的函数
  // 它需要接收后端给的 token 和 user 对象
  login: (token: string, user: AuthUser) => void;

  // 4. 方法：退出登录
  // 它需要清理 LocalStorage 和 context 状态
  logout: () => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await meApi();
        setUser(res.data.user);
      } catch (_) {
        localStorage.removeItem("token");
        setUser(null);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, user: AuthUser) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
