import { recordAuditLog } from "@/lib/audit";
import { createFormSubmission } from "@/repositories/form-submission.repository";
import type { CreateFormSubmissionInput } from "@/validations/form-submission.validation";

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
    entityType: "FormSubmission",
    entityId: submission.id,
    newData: submission,
    ipAddress: ip,
  });

  return submission;
}
