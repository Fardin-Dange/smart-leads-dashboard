import { Types } from "mongoose";
import { Lead } from "../models/lead.model";
import type {
  CreateLeadInput,
  LeadListItem,
  LeadQueryOptions,
  PaginatedLeadsResult,
  UpdateLeadInput
} from "../types/lead.types";
import { ApiError } from "../utils/apiError";

const leadPopulateOptions = {
  path: "createdBy",
  select: "name email role"
} as const;

const leadListSelect = "name email status source createdAt createdBy";

type LeadSearchRegexFilter = {
  $or?: Array<{ name: RegExp } | { email: RegExp }>;
};

type LeadFilter = Partial<Pick<CreateLeadInput, "status" | "source">> & LeadSearchRegexFilter;

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const buildLeadFilter = (options: LeadQueryOptions): LeadFilter => {
  const filter: LeadFilter = {};

  if (options.status) {
    filter.status = options.status;
  }

  if (options.source) {
    filter.source = options.source;
  }

  if (options.search) {
    const searchRegex = new RegExp(escapeRegex(options.search), "i");
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

export const createLead = async (input: CreateLeadInput) => {
  const lead = await Lead.create({
    name: input.name,
    email: input.email,
    status: input.status ?? "New",
    source: input.source,
    createdBy: new Types.ObjectId(input.createdBy)
  });

  return lead.populate(leadPopulateOptions);
};

export const getLeads = async (
  options: LeadQueryOptions
): Promise<PaginatedLeadsResult<LeadListItem>> => {
  const filter = buildLeadFilter(options);
  const skip = (options.page - 1) * options.limit;
  const sortDirection: 1 | -1 = options.sort === "oldest" ? 1 : -1;
  const sortOptions = { createdAt: sortDirection } as const;

  try {
    const [total, leads] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .select(leadListSelect)
        .sort(sortOptions)
        .skip(skip)
        .limit(options.limit)
        .populate(leadPopulateOptions)
        .lean<LeadListItem[]>()
    ]);

    return {
      results: leads.length,
      pagination: {
        total,
        page: options.page,
        pages: Math.ceil(total / options.limit),
        limit: options.limit
      },
      data: leads
    };
  } catch (error) {
    console.error("Failed to retrieve leads", {
      filter,
      page: options.page,
      limit: options.limit,
      sort: options.sort,
      error
    });
    throw new ApiError(500, "Failed to retrieve leads");
  }
};

export const getLeadById = async (id: string) => {
  const lead = await Lead.findById(id).populate(leadPopulateOptions);

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  return lead;
};

export const updateLead = async (id: string, input: UpdateLeadInput) => {
  const lead = await Lead.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true
  }).populate(leadPopulateOptions);

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  return lead;
};

export const deleteLead = async (id: string): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(id);

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }
};
