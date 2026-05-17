import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { authApi } from "../api/auth";
import type { LoginCredentials, RegisterCredentials, User } from "../types/auth";
import { storage } from "../utils/storage";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [user, setUser] = useState<User | null>(() => storage.getUser<User>());

  const setAuthSession = useCallback((nextUser: User, nextToken: string): void => {
    if (!nextToken || !nextUser) {
      throw new Error("Cannot store an incomplete auth session");
    }

    storage.setToken(nextToken);
    storage.setUser(nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      const data = await authApi.login(credentials);
      setAuthSession(data.user, data.token);
    },
    [setAuthSession]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<void> => {
      const data = await authApi.register(credentials);
      setAuthSession(data.user, data.token);
    },
    [setAuthSession]
  );

  const logout = useCallback((): void => {
    storage.clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout
    }),
    [login, logout, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
