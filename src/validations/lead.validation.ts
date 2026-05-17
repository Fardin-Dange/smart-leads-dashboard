import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { leadSources, leadStatuses } from "../types/lead.types";

export const createLeadSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must be at most 80 characters"),
    email: z.string().trim().email("Email must be valid").toLowerCase(),
    status: z.enum(leadStatuses).optional().default("New"),
    source: z.enum(leadSources)
  })
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: z.string().refine(isValidObjectId, "Lead id is invalid")
  }),
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(80, "Name must be at most 80 characters")
        .optional(),
      email: z.string().trim().email("Email must be valid").toLowerCase().optional(),
      status: z.enum(leadStatuses).optional(),
      source: z.enum(leadSources).optional()
    })
    .strict()
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required to update"
    })
});

export const leadIdParamSchema = z.object({
  params: z.object({
    id: z.string().refine(isValidObjectId, "Lead id is invalid")
  })
});

const pageSchema = z
  .string()
  .trim()
  .optional()
  .default("1")
  .refine((value) => /^\d+$/.test(value), "Page must be a positive integer")
  .transform(Number)
  .refine((value) => value >= 1, "Page must be greater than or equal to 1");

export const getLeadsQuerySchema = z.object({
  query: z.object({
    page: pageSchema,
    status: z.enum(leadStatuses).optional(),
    source: z.enum(leadSources).optional(),
    search: z
      .string()
      .trim()
      .min(1, "Search must not be empty")
      .max(80, "Search must be at most 80 characters")
      .optional(),
    sort: z.enum(["latest", "oldest"]).optional().default("latest")
  })
});

export type CreateLeadBody = z.infer<typeof createLeadSchema>["body"];
export type UpdateLeadBody = z.infer<typeof updateLeadSchema>["body"];
export type LeadIdParams = z.infer<typeof leadIdParamSchema>["params"];
export type GetLeadsQuery = z.infer<typeof getLeadsQuerySchema>["query"];
