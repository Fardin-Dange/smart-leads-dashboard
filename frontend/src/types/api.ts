export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: Array<{
    path?: string;
    message?: string;
  }> | string[] | unknown;
}
