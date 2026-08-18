import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface CreateAuditLogInput {
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldData?: Prisma.InputJsonValue;
  newData?: Prisma.InputJsonValue;
  ipAddress: string | null;
}

/** `oldData`/`newData` are omitted entirely (not set to `null`) when the
 * caller has none — a create has no `oldData`, a delete has no `newData`. */
export function createAuditLog(input: CreateAuditLogInput) {
  return prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      ...(input.oldData !== undefined ? { oldData: input.oldData } : {}),
      ...(input.newData !== undefined ? { newData: input.newData } : {}),
      ipAddress: input.ipAddress,
    },
  });
}
