import "server-only";
import { logger } from "@/lib/logger";
import { createAuditLog } from "@/repositories/audit-log.repository";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "PUBLISH" | "UNPUBLISH" | "REORDER";

interface RecordAuditLogInput {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldData?: unknown;
  newData?: unknown;
  ipAddress: string;
}

/** Round-trips a Prisma entity through JSON so `Date`/`Decimal` fields
 * become plain JSON-safe values before being stored in a `Json` column. */
function toJsonSafe(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Best-effort audit write: failures are logged, never thrown — an audit
 * log outage must not block the mutation it's describing (same reasoning
 * as `forgotPassword`'s email-send failure handling).
 */
export async function recordAuditLog(input: RecordAuditLogInput): Promise<void> {
  try {
    await createAuditLog({
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      oldData: input.oldData === undefined ? undefined : toJsonSafe(input.oldData),
      newData: input.newData === undefined ? undefined : toJsonSafe(input.newData),
      ipAddress: input.ipAddress,
    });
  } catch (error) {
    logger.error("Failed to write audit log", {
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
