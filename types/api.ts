export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
}
