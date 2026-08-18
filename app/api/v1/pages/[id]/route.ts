import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSessionUser, requirePermission } from "@/lib/rbac";
import { idParamSchema, validateJsonBody, validateParams } from "@/lib/validation";
import { deletePageById, getPageBySlugForViewer, updatePageForUser } from "@/services/page.service";
import { updatePageSchema } from "@/validations/page.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RouteContext {
  params: Promise<{ id: string }>;
}

// This route's dynamic segment holds a page *slug* here, not the numeric
// `id` used by PATCH/DELETE below — Next.js requires every handler sharing
// this path position to use the same param name, so `id` is reused for
// both meanings (see `app/api/v1/pages/route.ts`'s sibling `GET` for the
// list endpoint, and `[id]/publish`/`[id]/unpublish` for the id-keyed
// action endpoints).
export async function GET(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`pages:detail:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const { id: slug } = validateParams(await context.params, idParamSchema);
    const viewer = await getSessionUser();
    const page = await getPageBySlugForViewer(slug, viewer);
    return apiSuccess({ page });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`pages:update:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("pages.update");
    const { id } = validateParams(await context.params, idParamSchema);
    const input = await validateJsonBody(request, updatePageSchema);
    const page = await updatePageForUser(id, input, user.id, ip);
    return apiSuccess({ page });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`pages:delete:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("pages.delete");
    const { id } = validateParams(await context.params, idParamSchema);
    await deletePageById(id, user.id, ip);
    return apiSuccess({ message: "Page deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
