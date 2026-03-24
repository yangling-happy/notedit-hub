import apiClient from "./client";
import type { AuthUser } from "../contexts/authContext";

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const loginApi = (data: { username: string; password: string }) =>
  apiClient.post<AuthResponse>("/api/auth/login", data);

export const registerApi = (data: { username: string; password: string }) =>
  apiClient.post<AuthResponse>("/api/auth/register", data);

export const meApi = () => apiClient.get<{ user: AuthUser }>("/api/auth/me");
