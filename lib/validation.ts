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

/** Default cap for `validateJsonBody` — generous for the small JSON
 * payloads (login, form fields, etc.) this API currently accepts. Pass a
 * larger `maxBytes` explicitly for an endpoint that legitimately needs
 * more. */
const DEFAULT_MAX_JSON_BODY_BYTES = 100 * 1024; // 100 KB

/**
 * Reads and validates a request's JSON body. Malformed JSON is treated as
 * a validation failure (400-class, not a 500) since it's caller error.
 *
 * Rejects (as a validation error, not a 500) any body whose declared
 * `Content-Length` exceeds `maxBytes` — a cheap first line of defense
 * against oversized-payload abuse before any parsing work happens. This
 * only checks the *declared* length, so it isn't airtight against a
 * client that sends a mismatched or absent `Content-Length` — full
 * protection would mean capping the stream itself, not worth the
 * complexity while every payload here is small JSON.
 */
export async function validateJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
  maxBytes: number = DEFAULT_MAX_JSON_BODY_BYTES,
): Promise<T> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new ValidationError("Request body is too large");
  }

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
