import type { User } from "./auth";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";
export type LeadSort = "latest" | "oldest";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  createdBy: Pick<User, "name" | "email" | "role"> & {
    _id: string;
  };
}

export interface LeadFormValues {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface LeadMutationResponse {
  success: boolean;
  message: string;
  data: {
    lead: Lead;
  };
}

export interface LeadQueryParams {
  page?: number;
  status?: LeadStatus | undefined;
  source?: LeadSource | undefined;
  search?: string | undefined;
  sort?: LeadSort | undefined;
}

export interface LeadsResponse {
  success: boolean;
  results: number;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  data: Lead[];
}
