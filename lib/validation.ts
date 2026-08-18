import { z, type ZodError, type ZodType } from "zod";
import type { ApiErrorDetail } from "@/types/api";
import { ValidationError } from "@/lib/errors";

/** Shared shape for any dynamic route with a single `[id]` segment — pass
 * to `validateParams` instead of redefining the same one-field schema in
 * every resource's route file. */
export const idParamSchema = z.object({
  id: z.string().min(1, "id is required"),
});

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
 *
 * Generic is `<S extends ZodType>` (returning `S["_output"]`) rather than
 * the simpler `<T>(schema: ZodType<T>)`, which collapses Zod's Output and
 * Input types into a single `T` — harmless for a schema whose Input and
 * Output match, but wrong the moment a field has `.default()`/`.transform()`
 * (Input is optional, Output isn't): inference would silently widen the
 * returned type back to the optional Input shape.
 */
export function validate<S extends ZodType>(schema: S, data: unknown): S["_output"] {
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
export async function validateJsonBody<S extends ZodType>(
  request: Request,
  schema: S,
  maxBytes: number = DEFAULT_MAX_JSON_BODY_BYTES,
): Promise<S["_output"]> {
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
export function validateSearchParams<S extends ZodType>(searchParams: URLSearchParams, schema: S): S["_output"] {
  return validate(schema, Object.fromEntries(searchParams.entries()));
}

/**
 * Validates dynamic route params (the object Next.js passes as
 * `context.params` in a route handler).
 */
export function validateParams<S extends ZodType>(params: unknown, schema: S): S["_output"] {
  return validate(schema, params);
}
