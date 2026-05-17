import type { Request, Response } from "express";
import type {
  CreateLeadBody,
  GetLeadsQuery,
  LeadIdParams,
  UpdateLeadBody
} from "../validations/lead.validation";
import * as leadService from "../services/lead.service";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

const getLoggedInUserId = (req: Request): string => {
  if (!req.user) {
    throw new ApiError(401, "Authentication is required");
  }

  return req.user.id;
};

export const createLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CreateLeadBody;
  const lead = await leadService.createLead({
    ...body,
    createdBy: getLoggedInUserId(req)
  });

  res.status(201).json({
    success: true,
    message: "Lead created successfully",
    data: {
      lead
    }
  });
});

export const updateLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as LeadIdParams;
  const lead = await leadService.updateLead(id, req.body as UpdateLeadBody);

  res.status(200).json({
    success: true,
    message: "Lead updated successfully",
    data: {
      lead
    }
  });
});

export const deleteLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as LeadIdParams;
  await leadService.deleteLead(id);

  res.status(204).send();
});

const LEADS_PER_PAGE = 10;

export const getLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = (req.validatedQuery ?? {
    page: 1,
    sort: "latest"
  }) as GetLeadsQuery;
  const result = await leadService.getLeads({
    ...query,
    limit: LEADS_PER_PAGE
  });

  res.status(200).json({
    success: true,
    results: result.results,
    pagination: result.pagination,
    data: result.data
  });
});

export const getLeadById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as LeadIdParams;
  const lead = await leadService.getLeadById(id);

  res.status(200).json({
    success: true,
    data: {
      lead
    }
  });
});
