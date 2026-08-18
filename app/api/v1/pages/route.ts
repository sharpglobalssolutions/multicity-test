import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSessionUser, requirePermission } from "@/lib/rbac";
import { validateJsonBody, validateSearchParams } from "@/lib/validation";
import { createPageForUser, listPagesForViewer } from "@/services/page.service";
import { createPageSchema, listPagesQuerySchema } from "@/validations/page.validation";

// Reads the session cookie on every request; must never be statically
// cached or served the same result for two different callers.
export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`pages:list:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const url = new URL(request.url);
    const query = validateSearchParams(url.searchParams, listPagesQuerySchema);
    const viewer = await getSessionUser();
    const { items, pagination } = await listPagesForViewer(query, viewer);
    return apiSuccess({ pages: items }, { meta: { pagination } });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`pages:create:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("pages.create");
    const input = await validateJsonBody(request, createPageSchema);
    const page = await createPageForUser(input, user.id, ip);
    return apiSuccess({ page }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
