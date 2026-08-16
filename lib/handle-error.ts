import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import type { NextResponse } from "next/server";
import type { ApiErrorDetail, ApiResponse } from "@/types/api";
import { apiError } from "@/lib/api-response";
import { AppError, ErrorCode, RateLimitError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const PRISMA_ERROR_TYPES = [
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
] as const;

function isPrismaError(error: unknown): boolean {
  return PRISMA_ERROR_TYPES.some((ErrorType) => error instanceof ErrorType);
}

/**
 * Central place route handlers funnel caught errors through, so every
 * endpoint returns the same { success: false, error } shape regardless of
 * whether the failure came from validation, a known AppError, a raw Prisma
 * error bubbling up from a repository, or something entirely unexpected.
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof ZodError) {
    const details: ApiErrorDetail[] = error.issues.map((issue) => ({
      field: issue.path.join(".") || undefined,
      message: issue.message,
    }));
    return apiError(
      { code: ErrorCode.VALIDATION_ERROR, message: "Validation failed", details },
      422,
    );
  }

  if (error instanceof AppError) {
    const headers =
      error instanceof RateLimitError && error.retryAfterSeconds !== undefined
        ? { "Retry-After": String(error.retryAfterSeconds) }
        : undefined;
    return apiError(
      { code: error.code, message: error.message, details: error.details },
      error.statusCode,
      headers,
    );
  }

  if (isPrismaError(error)) {
    logger.error("Database error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return apiError(
      { code: ErrorCode.DATABASE_ERROR, message: "A database error occurred" },
      503,
    );
  }

  logger.error("Unhandled API error", {
    error: error instanceof Error ? error.message : String(error),
  });
  return apiError(
    { code: ErrorCode.INTERNAL_SERVER_ERROR, message: "Internal server error" },
    500,
  );
}
