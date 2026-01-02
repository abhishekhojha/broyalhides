export interface ApiError {
  error?: string;
  errors?: string[];
  message?: string;
}

export interface SuccessResponse {
  success: boolean;
}
