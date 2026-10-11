import { Prisma } from "@prisma/client";
import type { SeoEntityType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { UpsertSeoMetadataInput } from "@/validations/seo.validation";

export function findByEntity(entityType: SeoEntityType, entityId: string) {
  return prisma.seoMetadata.findUnique({ where: { entityType_entityId: { entityType, entityId } } });
}

/** Same lookup as `findByEntity`, but also resolves `ogImage`/
 * `twitterImage` (both `Media` foreign keys) to their actual URLs — for a
 * detail page's `generateMetadata`, which needs a real image URL, not
 * just the id. Kept separate so `findByEntity`'s existing callers (which
 * don't need the join) are unaffected. */
export function findByEntityWithImages(entityType: SeoEntityType, entityId: string) {
  return prisma.seoMetadata.findUnique({
    where: { entityType_entityId: { entityType, entityId } },
    include: { ogImage: true, twitterImage: true },
  });
}

/** General upsert covering every `SeoMetadata` field — pre-existing
 * scaffold (`services/seo.service.ts`) built for a future full SEO editor,
 * never wired to a route until now. `schemaData` is Zod-validated as a
 * plain object, structurally JSON-safe at runtime but not statically
 * provable as such — same cast-after-validation pattern as
 * `page-section.repository.ts`'s `toInputJson`. */
export function upsertSeoMetadata(input: UpsertSeoMetadataInput) {
  const { entityType, entityId, schemaData, ...data } = input;
  // Prisma represents "clear this Json column" as `Prisma.JsonNull`, not a
  // plain JS `null` (which it reserves for "no value provided" in some
  // input types) — explicit sentinel required here or `null` is rejected
  // at the type level.
  const json =
    schemaData === null ? Prisma.JsonNull : (schemaData as Prisma.InputJsonValue | undefined);
  return prisma.seoMetadata.upsert({
    where: { entityType_entityId: { entityType, entityId } },
    update: { ...data, schemaData: json },
    create: { entityType, entityId, ...data, schemaData: json },
  });
}
