import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { idParamSchema, validateJsonBody, validateParams } from "@/lib/validation";
import { reorderSectionsForPage } from "@/services/page-section.service";
import { reorderPageSectionsSchema } from "@/validations/page-section.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `pages:sections:reorder:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("pages.update");
    const { id: pageId } = validateParams(await context.params, idParamSchema);
    const input = await validateJsonBody(request, reorderPageSectionsSchema);
    const sections = await reorderSectionsForPage(pageId, input, user.id, ip);
    return apiSuccess({ sections });
  } catch (error) {
    return handleApiError(error);
  }
}
