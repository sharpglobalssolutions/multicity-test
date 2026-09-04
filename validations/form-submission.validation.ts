import { FormSubmissionStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Deliberately generic — `FormSubmission.formType` is a free string shared
 * across every form on the site (contact, newsletter, quote request, etc.),
 * so this schema only enforces what's true for *all* of them. A specific
 * form (e.g. the flight-search quote request) enforces its own required
 * fields client-side before ever calling this endpoint; the server's job is
 * just to reject junk, not to know every form's exact shape.
 *
 * The "at least one contact field" rule alone would reject a legitimate
 * step-1-only capture (see `FlightSearch.tsx`'s criteria step, which has no
 * contact fields yet by design) — a non-empty `payload` is accepted as the
 * alternative proof this isn't a junk/empty POST.
 */
export const createFormSubmissionSchema = z
  .object({
    formType: z.string().trim().min(1, "Form type is required").max(64),
    name: z.string().trim().min(1, "Name is required").max(200).optional(),
    email: z.string().trim().email("Enter a valid email address").max(320).optional(),
    phone: z.string().trim().min(1, "Phone is required").max(32).optional(),
    payload: z.record(z.string(), z.unknown()),
  })
  .refine((data) => Boolean(data.name || data.email || data.phone) || Object.keys(data.payload).length > 0, {
    message: "At least one contact field or a non-empty payload is required",
  });

export type CreateFormSubmissionInput = z.infer<typeof createFormSubmissionSchema>;

/** Body for `PATCH /form-submissions/:id/complete` — attaches contact
 * details (and the now-complete payload) to a submission created earlier
 * without them. Public and unauthenticated, same as the create endpoint,
 * so this still requires at least one real contact field — unlike create,
 * a non-empty payload alone isn't enough here, since the whole point of
 * this call is capturing contact info. */
export const completeFormSubmissionSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(200).optional(),
    email: z.string().trim().email("Enter a valid email address").max(320).optional(),
    phone: z.string().trim().min(1, "Phone is required").max(32).optional(),
    payload: z.record(z.string(), z.unknown()),
  })
  .refine((data) => Boolean(data.name || data.email || data.phone), {
    message: "At least one contact field (name, email, or phone) is required",
  });

export type CompleteFormSubmissionInput = z.infer<typeof completeFormSubmissionSchema>;

/** Query params for the admin `GET /form-submissions` list. */
export const listFormSubmissionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).optional(),
  status: z.nativeEnum(FormSubmissionStatus).optional(),
  formType: z.string().trim().min(1).optional(),
  sortBy: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListFormSubmissionsQuery = z.infer<typeof listFormSubmissionsQuerySchema>;

export const updateFormSubmissionStatusSchema = z.object({
  status: z.nativeEnum(FormSubmissionStatus),
});

export type UpdateFormSubmissionStatusInput = z.infer<typeof updateFormSubmissionStatusSchema>;
