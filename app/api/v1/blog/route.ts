import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateSearchParams } from "@/lib/validation";
import { listFeaturedBlogPosts } from "@/services/blog.service";
import { listPublishedBlogPostsQuerySchema } from "@/validations/blog.validation";

// Always reflects the current published set — never statically cached.
export const dynamic = "force-dynamic";

const RATE_LIMIT = 60;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Public — returns only PUBLISHED posts, so no permission check is
 * needed (unlike the admin CRUD routes this module will eventually get). */
export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`blog:list:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const url = new URL(request.url);
    const { limit } = validateSearchParams(url.searchParams, listPublishedBlogPostsQuerySchema);
    const posts = await listFeaturedBlogPosts(limit);
    return apiSuccess({ posts });
  } catch (error) {
    return handleApiError(error);
  }
}
