import axios from "axios";
import type { ApiErrorResponse } from "../types/api";
import { storage } from "../utils/storage";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.details !== undefined) {
      if (Array.isArray(data.details)) {
        const details = data.details
          .map((detail) => {
            if (typeof detail === "string") {
              return detail;
            }

            if (
              typeof detail === "object" &&
              detail !== null &&
              "message" in detail &&
              typeof detail.message === "string"
            ) {
              return detail.message;
            }

            return null;
          })
          .filter((detail): detail is string => Boolean(detail));

        if (details.length > 0) {
          return details.join(", ");
        }
      }
    }

    if (data?.message) {
      return data.message;
    }

    if (error.response) {
      return `Request failed with status ${error.response.status}`;
    }

    if (error.request) {
      return "Unable to reach the API. Check that the backend is running and CORS allows this frontend.";
    }

    return error.message || "Request failed";
  }

  return "Something went wrong";
};
