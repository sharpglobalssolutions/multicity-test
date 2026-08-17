import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { UpsertSeoMetadataInput } from "@/validations/seo.validation";

export function upsertSeoMetadata(input: UpsertSeoMetadataInput) {
  const { entityType, entityId, schemaData, ...fields } = input;
  const jsonSchemaData = schemaData as Prisma.InputJsonValue | undefined;

  return prisma.seoMetadata.upsert({
    where: { entityType_entityId: { entityType, entityId } },
    create: { entityType, entityId, ...fields, schemaData: jsonSchemaData },
    update: { ...fields, schemaData: jsonSchemaData },
  });
}
