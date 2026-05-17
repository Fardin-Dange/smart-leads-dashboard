import type { Request, RequestHandler, Response } from "express";
import { ApiError } from "../utils/apiError";

export const notFound: RequestHandler = (req: Request, _res: Response): void => {
  throw new ApiError(404, `Route not found: ${req.originalUrl}`);
};
