export const leadStatuses = ["New", "Contacted", "Qualified", "Lost"] as const;
export const leadSources = ["Website", "Instagram", "Referral"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];

export interface CreateLeadInput {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  createdBy: string;
}

export interface UpdateLeadInput {
  name?: string | undefined;
  email?: string | undefined;
  status?: LeadStatus | undefined;
  source?: LeadSource | undefined;
}

export type LeadSortOrder = "latest" | "oldest";

export interface LeadQueryOptions {
  page: number;
  limit: number;
  sort: LeadSortOrder;
  status?: LeadStatus | undefined;
  source?: LeadSource | undefined;
  search?: string | undefined;
}

export interface LeadPagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface LeadCreatorSummary {
  _id: unknown;
  name: string;
  email: string;
  role: string;
}

export interface LeadListItem {
  _id: unknown;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  createdBy: LeadCreatorSummary | null;
}

export interface PaginatedLeadsResult<TLead> {
  results: number;
  pagination: LeadPagination;
  data: TLead[];
}
