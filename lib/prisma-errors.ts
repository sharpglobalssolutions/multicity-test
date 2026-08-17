import { Prisma } from "@prisma/client";

/** True for a unique-constraint violation (e.g. a duplicate slug/code) —
 * a 409 caused by the caller's input, not the generic 503 `handleApiError`
 * falls back to for an unrecognized Prisma error. Callers should catch
 * this specifically and rethrow as a `ConflictError` with a message naming
 * the field that collided. */
export function isUniqueConstraintError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/** True when a write targeted a row that no longer exists (e.g. an update
 * or delete by id that already lost a race with another delete) — a 404,
 * not a 503. */
export function isRecordNotFoundError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

/** True when a write references a foreign key that doesn't exist (e.g.
 * creating a flight offer with an `airlineId` that isn't a real airline)
 * — a 422 caused by the caller's input, not the generic 503 fallback. */
export function isForeignKeyConstraintError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003";
}
