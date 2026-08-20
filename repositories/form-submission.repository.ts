import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface CreateFormSubmissionData {
  formType: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  /** Zod validates this as `Record<string, unknown>` — JSON-safe at
   * runtime, but not structurally assignable to Prisma's `InputJsonValue`
   * without a cast (same reasoning as `page-section.repository.ts`). */
  payload: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
}

export function createFormSubmission(data: CreateFormSubmissionData) {
  return prisma.formSubmission.create({
    data: { ...data, payload: data.payload as Prisma.InputJsonValue },
  });
}
