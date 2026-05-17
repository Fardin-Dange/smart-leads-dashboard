import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { JwtPayload } from "../types/user.types";
import { ApiError } from "./apiError";

export const generateToken = (payload: JwtPayload): string => {
  const expiresIn = env.jwtExpiresIn as NonNullable<SignOptions["expiresIn"]>;
  const options: SignOptions = {
    expiresIn
  };

  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      !("role" in decoded)
    ) {
      throw new ApiError(401, "Invalid authentication token");
    }

    return {
      userId: String(decoded.userId),
      role: decoded.role as JwtPayload["role"]
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired authentication token");
  }
};
