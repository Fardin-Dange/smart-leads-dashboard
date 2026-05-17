import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";

interface ErrorResponse {
  success: false;
  message: string;
  details?: unknown;
  stack?: string;
}

const normalizeError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof MongooseError.ValidationError) {
    return new ApiError(400, "Validation failed", error.errors);
  }

  if (error instanceof MongooseError.CastError) {
    return new ApiError(400, "Invalid resource identifier");
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    return new ApiError(409, "Duplicate resource");
  }

  return new ApiError(500, "Internal server error");
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const normalizedError = normalizeError(error);

  if (!normalizedError.isOperational || normalizedError.statusCode >= 500) {
    console.error("Request failed", error);
  }

  const response: ErrorResponse = {
    success: false,
    message: normalizedError.message
  };

  if (normalizedError.details !== undefined) {
    response.details = normalizedError.details;
  }

  if (env.nodeEnv === "development" && normalizedError.stack !== undefined) {
    response.stack = normalizedError.stack;
  }

  res.status(normalizedError.statusCode).json(response);
};
