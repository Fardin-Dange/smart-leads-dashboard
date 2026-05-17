import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const healthCheck = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: "Smart Leads API is healthy",
    timestamp: new Date().toISOString()
  });
});
