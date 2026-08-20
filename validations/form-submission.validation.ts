import { z } from "zod";

/**
 * Deliberately generic — `FormSubmission.formType` is a free string shared
 * across every form on the site (contact, newsletter, quote request, etc.),
 * so this schema only enforces what's true for *all* of them. A specific
 * form (e.g. the flight-search quote request) enforces its own required
 * fields client-side before ever calling this endpoint; the server's job is
 * just to reject junk, not to know every form's exact shape.
 */
export const createFormSubmissionSchema = z
  .object({
    formType: z.string().trim().min(1, "Form type is required").max(64),
    name: z.string().trim().min(1, "Name is required").max(200).optional(),
    email: z.string().trim().email("Enter a valid email address").max(320).optional(),
    phone: z.string().trim().min(1, "Phone is required").max(32).optional(),
    payload: z.record(z.string(), z.unknown()),
  })
  .refine((data) => Boolean(data.name || data.email || data.phone), {
    message: "At least one contact field (name, email, or phone) is required",
  });

export type CreateFormSubmissionInput = z.infer<typeof createFormSubmissionSchema>;
