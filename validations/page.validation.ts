import { ContentStatus } from "@prisma/client";
import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric words separated by hyphens");

export const createPageSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: slugSchema,
  pageType: z.string().trim().min(1, "Page type is required"),
  template: z.string().trim().min(1, "Template is required"),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;

/** Every field optional — a PATCH updates only what's supplied — but at
 * least one must be present, or there's nothing to do.
 *
 * No `status` field here on purpose: lifecycle transitions go through the
 * dedicated `POST /pages/:id/publish` and `/unpublish` endpoints, which are
 * gated behind `pages.publish` specifically. Allowing `status` here would
 * let anyone with only `pages.update` (e.g. the EDITOR role) publish a page
 * by PATCHing around that permission check. */
export const updatePageSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").optional(),
    slug: slugSchema.optional(),
    pageType: z.string().trim().min(1, "Page type is required").optional(),
    template: z.string().trim().min(1, "Template is required").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdatePageInput = z.infer<typeof updatePageSchema>;

/** Query params for `GET /pages`. `URLSearchParams` only carries strings,
 * so numeric fields use `z.coerce` (see `lib/validation.ts`). */
export const listPagesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "publishedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListPagesQuery = z.infer<typeof listPagesQuerySchema>;
