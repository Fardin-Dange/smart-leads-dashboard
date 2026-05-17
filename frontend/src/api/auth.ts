import { apiClient } from "./client";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "../types/auth";

interface AuthSession {
  user: User;
  token: string;
}

const extractAuthSession = (response: AuthResponse): AuthSession => {
  const user = response.data?.user;
  const token = response.data?.token;

  if (!user || !token) {
    throw new Error("Authentication response is missing user or token");
  }

  return {
    user,
    token
  };
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return extractAuthSession(response.data);
  },
  register: async (credentials: RegisterCredentials): Promise<AuthSession> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", credentials);
    return extractAuthSession(response.data);
  }
};
