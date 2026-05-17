const TOKEN_KEY = "smart_leads_token";
const USER_KEY = "smart_leads_user";

export const storage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clearToken: (): void => localStorage.removeItem(TOKEN_KEY),
  getUser: <TUser>(): TUser | null => {
    const value = localStorage.getItem(USER_KEY);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as TUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },
  setUser: (user: unknown): void => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: (): void => localStorage.removeItem(USER_KEY),
  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
