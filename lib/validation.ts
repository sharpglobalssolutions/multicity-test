import type { ZodError, ZodType } from "zod";
import type { ApiErrorDetail } from "@/types/api";
import { ValidationError } from "@/lib/errors";

/**
 * Flattens a ZodError into the { field, message } shape every API error
 * response uses, so validation failures from any source (body, query,
 * params) surface identically.
 */
export function zodIssuesToDetails(error: ZodError): ApiErrorDetail[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || undefined,
    message: issue.message,
  }));
}

/**
 * Parses `data` against `schema`, throwing a `ValidationError` (caught by
 * `handleApiError`) instead of returning a Zod result the caller has to
 * check. This is the single choke point every other helper in this file
 * routes through, so all validation failures — regardless of source —
 * produce the same error shape.
 */
export function validate<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Validation failed", zodIssuesToDetails(result.error));
  }
  return result.data;
}

/**
 * Reads and validates a request's JSON body. Malformed JSON is treated as
 * a validation failure (400-class, not a 500) since it's caller error.
 */
export async function validateJsonBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
  return validate(schema, body);
}

/**
 * Validates a request's query string. `URLSearchParams` only supports
 * string values, so schemas for numeric/boolean query params should use
 * `z.coerce` (e.g. `z.coerce.number()`).
 */
export function validateSearchParams<T>(searchParams: URLSearchParams, schema: ZodType<T>): T {
  return validate(schema, Object.fromEntries(searchParams.entries()));
}

/**
 * Validates dynamic route params (the object Next.js passes as
 * `context.params` in a route handler).
 */
export function validateParams<T>(params: unknown, schema: ZodType<T>): T {
  return validate(schema, params);
}
