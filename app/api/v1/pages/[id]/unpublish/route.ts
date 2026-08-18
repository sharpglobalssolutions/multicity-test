import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { idParamSchema, validateParams } from "@/lib/validation";
import { unpublishPageById } from "@/services/page.service";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RouteContext {
  params: Promise<{ id: string }>;
}

// Same permission as publish (`pages.publish`) — unpublish is the reverse
// direction of the same lifecycle action, not a separate capability.
export async function POST(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`pages:unpublish:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("pages.publish");
    const { id } = validateParams(await context.params, idParamSchema);
    const page = await unpublishPageById(id, user.id, ip);
    return apiSuccess({ page });
  } catch (error) {
    return handleApiError(error);
  }
}
