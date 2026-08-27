import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { idParamSchema, validateJsonBody, validateParams } from "@/lib/validation";
import { getPageSeo, updatePageSeo } from "@/services/seo-metadata.service";
import { updateSeoMetadataSchema } from "@/validations/seo-metadata.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`pages:seo:read:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    await requirePermission("seo.read");
    const { id } = validateParams(await context.params, idParamSchema);
    const seo = await getPageSeo(id);
    return apiSuccess({ seo });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`pages:seo:update:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("seo.update");
    const { id } = validateParams(await context.params, idParamSchema);
    const input = await validateJsonBody(request, updateSeoMetadataSchema);
    const seo = await updatePageSeo(id, input, user.id, ip);
    return apiSuccess({ seo });
  } catch (error) {
    return handleApiError(error);
  }
}
