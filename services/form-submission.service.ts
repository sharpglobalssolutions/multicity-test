import type { FormSubmissionStatus, Prisma } from "@prisma/client";
import { recordAuditLog } from "@/lib/audit";
import { NotFoundError } from "@/lib/errors";
import { isRecordNotFoundError } from "@/lib/prisma-errors";
import {
  createFormSubmission,
  findFormSubmissionById,
  listFormSubmissions,
  updateFormSubmissionContact,
  updateFormSubmissionStatus,
} from "@/repositories/form-submission.repository";
import type {
  CompleteFormSubmissionInput,
  CreateFormSubmissionInput,
  ListFormSubmissionsQuery,
} from "@/validations/form-submission.validation";

const ENTITY_TYPE = "FormSubmission";

export async function submitForm(input: CreateFormSubmissionInput, ip: string, userAgent: string | null) {
  const submission = await createFormSubmission({
    formType: input.formType,
    name: input.name ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    payload: input.payload,
    ipAddress: ip,
    userAgent,
  });

  // No authenticated actor for a public form submission — `userId: null`
  // is valid here (see `lib/audit.ts`).
  await recordAuditLog({
    userId: null,
    action: "CREATE",
    entityType: ENTITY_TYPE,
    entityId: submission.id,
    newData: submission,
    ipAddress: ip,
  });

  return submission;
}

/** Attaches contact details to a submission created earlier without them
 * (see `createFormSubmissionSchema`'s payload-only allowance) — the public
 * counterpart to a multi-step form's second step. Same no-ownership-check
 * trust model as `submitForm`: knowing the unguessable cuid `id` is the
 * only "authorization" a public caller has, same as the create endpoint. */
export async function completeFormSubmission(id: string, input: CompleteFormSubmissionInput, ip: string) {
  const before = await findFormSubmissionById(id);
  if (!before) {
    throw new NotFoundError("Form submission not found");
  }

  let submission;
  try {
    submission = await updateFormSubmissionContact(id, {
      name: input.name ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      payload: input.payload,
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Form submission not found");
    }
    throw error;
  }

  await recordAuditLog({
    userId: null,
    action: "UPDATE",
    entityType: ENTITY_TYPE,
    entityId: id,
    oldData: before,
    newData: submission,
    ipAddress: ip,
  });

  return submission;
}

export async function listFormSubmissionsForAdmin(query: ListFormSubmissionsQuery) {
  const where: Prisma.FormSubmissionWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.formType ? { formType: query.formType } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { phone: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const { items, total } = await listFormSubmissions({
    where,
    orderBy: { [query.sortBy]: query.sortOrder },
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  });

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / query.limit),
    },
  };
}

export async function getFormSubmissionByIdForUser(id: string) {
  const submission = await findFormSubmissionById(id);
  if (!submission) {
    throw new NotFoundError("Form submission not found");
  }
  return submission;
}

export async function updateFormSubmissionStatusForUser(
  id: string,
  status: FormSubmissionStatus,
  userId: string,
  ip: string,
) {
  const before = await findFormSubmissionById(id);
  if (!before) {
    throw new NotFoundError("Form submission not found");
  }

  let submission;
  try {
    submission = await updateFormSubmissionStatus(id, status);
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Form submission not found");
    }
    throw error;
  }

  await recordAuditLog({
    userId,
    action: "UPDATE",
    entityType: ENTITY_TYPE,
    entityId: id,
    oldData: before,
    newData: submission,
    ipAddress: ip,
  });

  return submission;
}
