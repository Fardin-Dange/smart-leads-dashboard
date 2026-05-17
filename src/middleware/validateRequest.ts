import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, type ZodSchema } from "zod";
import { ApiError } from "../utils/apiError";

export const validateRequest = (schema: ZodSchema): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      }) as {
        body?: unknown;
        params?: Record<string, string>;
        query?: unknown;
      };

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }

      if (parsed.params !== undefined) {
        req.params = parsed.params;
      }

      if (parsed.query !== undefined) {
        req.validatedQuery = parsed.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ApiError(
            400,
            "Validation failed",
            error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message
            }))
          )
        );
        return;
      }

      next(error);
    }
  };
};
