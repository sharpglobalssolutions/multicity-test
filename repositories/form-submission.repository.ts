import type { FormSubmissionStatus, Prisma } from "@prisma/client";
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

export function findFormSubmissionById(id: string) {
  return prisma.formSubmission.findUnique({ where: { id } });
}

export interface ListFormSubmissionsOptions {
  where: Prisma.FormSubmissionWhereInput;
  orderBy: Prisma.FormSubmissionOrderByWithRelationInput;
  skip: number;
  take: number;
}

export async function listFormSubmissions({ where, orderBy, skip, take }: ListFormSubmissionsOptions) {
  const [items, total] = await Promise.all([
    prisma.formSubmission.findMany({ where, orderBy, skip, take }),
    prisma.formSubmission.count({ where }),
  ]);
  return { items, total };
}

export interface CompleteFormSubmissionData {
  name: string | null;
  email: string | null;
  phone: string | null;
  payload: Record<string, unknown>;
}

/** Attaches contact details to a submission created without them (the
 * flight-search widget's step-1 capture) — overwrites `payload` wholesale
 * with the caller's current (now-complete) criteria rather than merging,
 * since the client already holds the full up-to-date state. */
export function updateFormSubmissionContact(id: string, data: CompleteFormSubmissionData) {
  return prisma.formSubmission.update({
    where: { id },
    data: { ...data, payload: data.payload as Prisma.InputJsonValue },
  });
}

export function updateFormSubmissionStatus(id: string, status: FormSubmissionStatus) {
  return prisma.formSubmission.update({ where: { id }, data: { status } });
}
