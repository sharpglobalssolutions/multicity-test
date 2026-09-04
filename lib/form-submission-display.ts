import type { FormSubmission } from "@prisma/client";

/** Known `formType` values in use across the site's forms (see
 * `NewsletterForm.tsx`, `GetInTouchForm.tsx`, `FlightSearch.tsx` /
 * `components/quote/QuoteForm.tsx`) — used to build the admin filter's
 * options list. `formType` itself stays a free string (not an enum) so a
 * new form type never needs a migration; this list is just a UI nicety. */
export const KNOWN_FORM_TYPES = [
  { value: "flight_quote_request", label: "Flight Quote Request" },
  { value: "get_in_touch", label: "Get in Touch" },
  { value: "newsletter_subscribe", label: "Newsletter" },
];

const KNOWN_FORM_TYPE_LABELS = new Map(KNOWN_FORM_TYPES.map((type) => [type.value, type.label]));

/** Falls back to title-casing an unrecognized `formType` (e.g. one added
 * to a new form later without updating `KNOWN_FORM_TYPES`) rather than
 * showing the raw snake_case string. */
export function formTypeLabel(formType: string): string {
  return (
    KNOWN_FORM_TYPE_LABELS.get(formType) ??
    formType
      .split(/[_-]/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

/** A submission created from a multi-step form's first step (e.g.
 * `FlightSearch.tsx`'s criteria step) before the visitor ever reached — or
 * abandoned before finishing — the contact step. Carries real criteria in
 * `payload` but no way to reach the person yet. */
export function isIncompleteSubmission(submission: Pick<FormSubmission, "name" | "email" | "phone">): boolean {
  return !submission.name && !submission.email && !submission.phone;
}
