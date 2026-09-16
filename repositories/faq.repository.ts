import type { FaqEntityType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** The `Faq` model supports a polymorphic entity link (`entityType`/
 * `entityId`, e.g. `"BLOG_POST"` + a post id) but nothing in the codebase
 * queried it that way before this — only `SeoMetadata` had an equivalent
 * `findByEntity` helper. */
export function findActiveFaqsByEntity(entityType: FaqEntityType, entityId: string) {
  return prisma.faq.findMany({
    where: { entityType, entityId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}
