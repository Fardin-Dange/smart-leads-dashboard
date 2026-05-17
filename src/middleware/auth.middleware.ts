import type { NextFunction, Request, RequestHandler, Response } from "express";
import { User } from "../models/user.model";
import type { UserRole } from "../types/user.types";
import { ApiError } from "../utils/apiError";
import { verifyToken } from "../utils/jwt";

const getBearerToken = (authorizationHeader: string | undefined): string => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required");
  }

  return authorizationHeader.split(" ")[1] ?? "";
};

export const protect: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = getBearerToken(req.headers.authorization);
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);

    if (!user) {
      throw new ApiError(401, "User for this token no longer exists");
    }

    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: UserRole[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, "Authentication is required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, "You do not have permission to access this resource"));
      return;
    }

    next();
  };
};
