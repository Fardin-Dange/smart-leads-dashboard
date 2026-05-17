import type { Request, Response } from "express";
import type { LoginBody, RegisterBody } from "../validations/auth.validation";
import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.service";

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.registerUser(req.body as RegisterBody);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result
  });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.loginUser(req.body as LoginBody);

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: result
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
});

export const adminOnlyExample = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      message: "Admin access granted"
    });
  }
);
