import type { ApiErrorDetail } from "@/types/api";

/**
 * The full set of error codes any API response can carry. Centralized here
 * so every layer (errors, response builders, handlers, and eventually
 * clients) references the same finite set instead of ad-hoc strings.
 */
export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  DATABASE_ERROR: "DATABASE_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Base class for errors that should be translated into a specific HTTP
 * status + error code by the API layer, as opposed to unexpected/unknown
 * errors which should surface as a generic 500. Route handlers, services,
 * and repositories should throw one of the subclasses below (or `AppError`
 * directly for a one-off case) rather than building an error response by
 * hand — `handleApiError` in `lib/handle-error.ts` is what turns these into
 * the standard `{ success: false, error }` envelope.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: ErrorCode,
    public readonly details: ApiErrorDetail[] = [],
  ) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** 422 — request input failed schema validation. */
export class ValidationError extends AppError {
  constructor(message = "Validation failed", details: ApiErrorDetail[] = []) {
    super(message, 422, ErrorCode.VALIDATION_ERROR, details);
  }
}

/** 401 — the request has no (or an invalid) authentication credential. */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details: ApiErrorDetail[] = []) {
    super(message, 401, ErrorCode.UNAUTHORIZED, details);
  }
}

/** 403 — the caller is authenticated but not allowed to perform this action. */
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details: ApiErrorDetail[] = []) {
    super(message, 403, ErrorCode.FORBIDDEN, details);
  }
}

/** 404 — the requested resource does not exist. */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details: ApiErrorDetail[] = []) {
    super(message, 404, ErrorCode.NOT_FOUND, details);
  }
}

/** 409 — the request conflicts with the current state of the resource. */
export class ConflictError extends AppError {
  constructor(message = "Resource conflict", details: ApiErrorDetail[] = []) {
    super(message, 409, ErrorCode.CONFLICT, details);
  }
}

/** 429 — the caller has exceeded an allowed request rate. */
export class RateLimitError extends AppError {
  constructor(message = "Too many requests", details: ApiErrorDetail[] = []) {
    super(message, 429, ErrorCode.RATE_LIMITED, details);
  }
}

/** 503 — a database operation failed (connection, timeout, etc.). */
export class DatabaseError extends AppError {
  constructor(message = "A database error occurred", details: ApiErrorDetail[] = []) {
    super(message, 503, ErrorCode.DATABASE_ERROR, details);
  }
}

/** 500 — an unexpected failure with no more specific classification. */
export class InternalServerError extends AppError {
  constructor(message = "Internal server error", details: ApiErrorDetail[] = []) {
    super(message, 500, ErrorCode.INTERNAL_SERVER_ERROR, details);
  }
}
