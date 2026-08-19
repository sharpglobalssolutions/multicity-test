import { z } from "zod";

/** The fixed set of section types this platform renders. Kept as a Zod
 * enum rather than a Prisma enum — `PageSection.sectionType` stays a plain
 * string column (see prisma/schema.prisma), matching this project's
 * convention of validating closed content vocabularies at the Zod layer
 * instead of migrating the database every time the set changes. */
export const SECTION_TYPES = [
  "HERO",
  "TEXT",
  "IMAGE_TEXT",
  "FEATURES",
  "CTA",
  "FAQ",
  "REVIEWS",
  "DEALS",
  "DESTINATIONS",
  "ROUTES",
  "AIRLINES",
  "BLOG",
] as const;

export const sectionTypeSchema = z.enum(SECTION_TYPES);

/** `PageSection.data` is intentionally freeform JSON — its shape varies
 * per `sectionType` (see the model's doc comment) — so this only enforces
 * that it's a plain JSON object, not a specific per-type structure. */
const sectionDataSchema = z.record(z.string(), z.unknown());

export const createPageSectionSchema = z.object({
  sectionType: sectionTypeSchema,
  title: z.string().trim().min(1, "Title is required").optional(),
  subtitle: z.string().trim().min(1, "Subtitle is required").optional(),
  content: z.string().trim().min(1, "Content is required").optional(),
  data: sectionDataSchema.optional(),
  /** Omit to append at the end of the page's current sections. */
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type CreatePageSectionInput = z.infer<typeof createPageSectionSchema>;

/** Every field optional — a PATCH updates only what's supplied — but at
 * least one must be present, or there's nothing to do. Bulk position
 * changes go through `reorderPageSectionsSchema` below, not `sortOrder`
 * here, to keep a single section's edit from silently shuffling others. */
export const updatePageSectionSchema = z
  .object({
    sectionType: sectionTypeSchema.optional(),
    title: z.string().trim().min(1, "Title is required").optional(),
    subtitle: z.string().trim().min(1, "Subtitle is required").optional(),
    content: z.string().trim().min(1, "Content is required").optional(),
    data: sectionDataSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdatePageSectionInput = z.infer<typeof updatePageSectionSchema>;

/** `sectionIds` must be the page's *entire* current section list, in the
 * new order — the service rejects a partial or foreign set rather than
 * guessing what should happen to an omitted section. */
export const reorderPageSectionsSchema = z.object({
  sectionIds: z.array(z.string().min(1)).min(1, "At least one section id is required"),
});

export type ReorderPageSectionsInput = z.infer<typeof reorderPageSectionsSchema>;

/** Params shape for routes nested under a page's sections that also
 * target one specific section (`PATCH`/`DELETE .../sections/:sectionId`). */
export const pageSectionParamsSchema = z.object({
  id: z.string().min(1, "id is required"),
  sectionId: z.string().min(1, "sectionId is required"),
});
