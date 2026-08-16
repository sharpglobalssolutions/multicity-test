import { NextResponse } from "next/server";
import type { ApiErrorDetail, ApiMeta, ApiResponse } from "@/types/api";

interface ApiSuccessOptions {
  status?: number;
  meta?: ApiMeta;
}

/**
 * Builds the { success: true, data, meta } envelope every v1 route should
 * return on success, wrapped in a NextResponse with the given HTTP status.
 */
export function apiSuccess<T>(
  data: T,
  options: ApiSuccessOptions = {},
): NextResponse<ApiResponse<T>> {
  const { status = 200, meta = {} } = options;
  return NextResponse.json({ success: true, data, meta }, { status });
}

interface ApiErrorInput {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

/**
 * Builds the { success: false, error } envelope for failed requests.
 */
export function apiError(
  error: ApiErrorInput,
  status = 400,
  headers?: HeadersInit,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? [],
      },
    },
    { status, headers },
  );
}
