import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { idParamSchema, validateJsonBody, validateParams } from "@/lib/validation";
import { deletePageById, updatePageForUser } from "@/services/page.service";
import { updatePageSchema } from "@/validations/page.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RouteContext {
  params: Promise<{ id: string }>;
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
    const page = await updatePageForUser(id, input, user.id);
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

    await requirePermission("pages.delete");
    const { id } = validateParams(await context.params, idParamSchema);
    await deletePageById(id);
    return apiSuccess({ message: "Page deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
