import { apiClient } from "./client";
import type { Lead, LeadFormValues, LeadMutationResponse, LeadQueryParams, LeadsResponse } from "../types/lead";

export const leadsApi = {
  getLeads: async (params: LeadQueryParams): Promise<LeadsResponse> => {
    const response = await apiClient.get<LeadsResponse>("/leads", { params });
    return response.data;
  },
  createLead: async (payload: LeadFormValues): Promise<Lead> => {
    const response = await apiClient.post<LeadMutationResponse>("/leads", payload);
    return response.data.data.lead;
  },
  updateLead: async (id: string, payload: Partial<LeadFormValues>): Promise<Lead> => {
    const response = await apiClient.patch<LeadMutationResponse>(`/leads/${id}`, payload);
    return response.data.data.lead;
  },
  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  }
};
