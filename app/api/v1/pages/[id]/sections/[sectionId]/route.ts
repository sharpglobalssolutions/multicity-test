import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { validateJsonBody, validateParams } from "@/lib/validation";
import { deleteSectionForPage, updateSectionForPage } from "@/services/page-section.service";
import { pageSectionParamsSchema, updatePageSectionSchema } from "@/validations/page-section.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RouteContext {
  params: Promise<{ id: string; sectionId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `pages:sections:update:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("pages.update");
    const { id: pageId, sectionId } = validateParams(await context.params, pageSectionParamsSchema);
    const input = await validateJsonBody(request, updatePageSectionSchema);
    const section = await updateSectionForPage(pageId, sectionId, input, user.id, ip);
    return apiSuccess({ section });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `pages:sections:delete:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("pages.update");
    const { id: pageId, sectionId } = validateParams(await context.params, pageSectionParamsSchema);
    await deleteSectionForPage(pageId, sectionId, user.id, ip);
    return apiSuccess({ message: "Page section deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
