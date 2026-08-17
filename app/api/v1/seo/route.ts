import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { validateJsonBody } from "@/lib/validation";
import { upsertSeoMetadataForEntity } from "@/services/seo.service";
import { upsertSeoMetadataSchema } from "@/validations/seo.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Creates or replaces the SEO metadata for one entity — identified by
 * `(entityType, entityId)` in the body, not a path param, since the same
 * permission (`seo.update`) covers every entity type this way instead of
 * needing a route per type. */
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`seo:update:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    await requirePermission("seo.update");
    const input = await validateJsonBody(request, upsertSeoMetadataSchema);
    const seoMetadata = await upsertSeoMetadataForEntity(input);
    return apiSuccess({ seoMetadata });
  } catch (error) {
    return handleApiError(error);
  }
}
