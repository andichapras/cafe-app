import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

export function successResponse<T>(data: T, message: string, status = 200) {
  const response: ApiSuccessResponse<T> = {
    data,
    message,
  };

  return Response.json(response, {
    status,
  });
}

export function errorResponse(error: string, status = 500) {
  const response: ApiErrorResponse = {
    error,
  };

  return Response.json(response, {
    status,
  });
}
