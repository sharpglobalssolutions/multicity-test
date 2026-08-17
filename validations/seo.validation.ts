import { SeoEntityType } from "@prisma/client";
import { z } from "zod";

/** Creates or replaces the SEO metadata for one entity, identified
 * polymorphically by `(entityType, entityId)` — the same unique key the
 * `SeoMetadata` model enforces. */
export const upsertSeoMetadataSchema = z.object({
  entityType: z.nativeEnum(SeoEntityType),
  entityId: z.string().trim().min(1, "entityId is required"),
  seoTitle: z.string().trim().min(1).optional(),
  metaDescription: z.string().trim().min(1).optional(),
  canonicalUrl: z.string().trim().url("Enter a valid URL").optional(),
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
  ogTitle: z.string().trim().min(1).optional(),
  ogDescription: z.string().trim().min(1).optional(),
  twitterTitle: z.string().trim().min(1).optional(),
  twitterDescription: z.string().trim().min(1).optional(),
  schemaType: z.string().trim().min(1).optional(),
  schemaData: z.record(z.unknown()).optional(),
});

export type UpsertSeoMetadataInput = z.infer<typeof upsertSeoMetadataSchema>;
