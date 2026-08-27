import { recordAuditLog } from "@/lib/audit";
import { NotFoundError } from "@/lib/errors";
import { findPageById } from "@/repositories/page.repository";
import { findByEntity, upsertByEntity } from "@/repositories/seo-metadata.repository";
import type { UpdateSeoMetadataInput } from "@/validations/seo-metadata.validation";

const ENTITY_TYPE = "PAGE";

async function getPageOr404(pageId: string) {
  const page = await findPageById(pageId);
  if (!page) {
    throw new NotFoundError("Page not found");
  }
  return page;
}

export async function getPageSeo(pageId: string) {
  await getPageOr404(pageId);
  return findByEntity(ENTITY_TYPE, pageId);
}

export async function updatePageSeo(pageId: string, input: UpdateSeoMetadataInput, userId: string, ip: string) {
  await getPageOr404(pageId);
  const before = await findByEntity(ENTITY_TYPE, pageId);

  const metadata = await upsertByEntity(ENTITY_TYPE, pageId, input);

  await recordAuditLog({
    userId,
    action: before ? "UPDATE" : "CREATE",
    entityType: "SeoMetadata",
    entityId: metadata.id,
    oldData: before,
    newData: metadata,
    ipAddress: ip,
  });

  return metadata;
}
