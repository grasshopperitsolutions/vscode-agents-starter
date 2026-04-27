/**
 * responses.ts
 *
 * Typed response helpers for consistent API output shape:
 * { success: boolean, message: string, data?: T, error?: string }
 */

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export function successResponse<T>(
  message: string,
  data?: T
): ApiResponse<T> {
  return { success: true, message, ...(data !== undefined ? { data } : {}) };
}

export function errorResponse(message: string, error?: string): ApiResponse {
  return {
    success: false,
    message,
    ...(error ? { error } : {}),
  };
}
