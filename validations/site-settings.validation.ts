import { z } from "zod";

/** Raw HTML/script snippets pasted into the admin's Settings page (Google
 * Analytics, Google Tag Manager, a Search Console verification tag,
 * etc.) — injected site-wide via `RawCodeInjector` (see `app/layout.tsx`).
 * `null` clears a previously-saved snippet; `undefined` (omitted) leaves it
 * untouched, matching every other PATCH-style schema in this codebase. */
export const updateSiteSettingsSchema = z
  .object({
    headerCode: z.string().trim().max(20000, "Header code should be 20,000 characters or fewer").nullable().optional(),
    bodyCode: z.string().trim().max(20000, "Body code should be 20,000 characters or fewer").nullable().optional(),
    footerCode: z.string().trim().max(20000, "Footer code should be 20,000 characters or fewer").nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
