import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { validateSearchParams } from "@/lib/validation";
import { listBlogPostsForAdmin } from "@/services/blog.service";
import { listBlogPostsQuerySchema } from "@/validations/blog.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Admin list — every status, with search/pagination/sort, gated behind
 * `blog.read`. Kept as its own route (rather than reusing `GET /blog`,
 * which is public/published-only/limit-only) since the two have
 * genuinely different query contracts, same as how Pages' admin list
 * lives at a different path (`/api/v1/pages`) than nothing-public-facing
 * exists for pages at all — blog is the one resource here with both a
 * public feed and an admin list. */
export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`blog:admin-list:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    await requirePermission("blog.read");
    const url = new URL(request.url);
    const query = validateSearchParams(url.searchParams, listBlogPostsQuerySchema);
    const { items, pagination } = await listBlogPostsForAdmin(query);
    return apiSuccess({ posts: items }, { meta: { pagination } });
  } catch (error) {
    return handleApiError(error);
  }
}
