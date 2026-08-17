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
 * least one must be present, or there's nothing to do. */
export const updatePageSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").optional(),
    slug: slugSchema.optional(),
    pageType: z.string().trim().min(1, "Page type is required").optional(),
    template: z.string().trim().min(1, "Template is required").optional(),
    status: z.nativeEnum(ContentStatus).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdatePageInput = z.infer<typeof updatePageSchema>;
