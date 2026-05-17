export const userRoles = ["admin", "sales"] as const;

export type UserRole = (typeof userRoles)[number];

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
