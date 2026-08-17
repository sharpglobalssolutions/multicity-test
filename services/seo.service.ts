import { upsertSeoMetadata } from "@/repositories/seo-metadata.repository";
import type { UpsertSeoMetadataInput } from "@/validations/seo.validation";

export function upsertSeoMetadataForEntity(input: UpsertSeoMetadataInput) {
  return upsertSeoMetadata(input);
}
