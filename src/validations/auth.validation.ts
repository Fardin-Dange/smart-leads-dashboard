import { z } from "zod";
import { userRoles } from "../types/user.types";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must be at most 80 characters"),
    email: z.string().trim().email("Email must be valid").toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
    role: z.enum(userRoles).optional().default("sales")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Email must be valid").toLowerCase(),
    password: z.string().min(1, "Password is required")
  })
});

export type RegisterBody = z.infer<typeof registerSchema>["body"];
export type LoginBody = z.infer<typeof loginSchema>["body"];
