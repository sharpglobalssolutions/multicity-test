import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { idParamSchema, validateParams } from "@/lib/validation";
import { getPublishedBlogPostBySlug } from "@/services/blog.service";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 60;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Public — the dynamic segment carries the post's *slug* (public article
 * pages are addressed by slug, e.g. /insights/[slug]), reusing the shared
 * `[id]` folder/param name only because Next.js requires every route under
 * `blog/` to agree on one dynamic segment name (this one already hosts
 * `[id]/publish`, which really is an id). Only ever returns PUBLISHED
 * posts, so no permission check is needed. */
export async function GET(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`blog:get:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const { id: slug } = validateParams(await context.params, idParamSchema);
    const post = await getPublishedBlogPostBySlug(slug);
    return apiSuccess({ post });
  } catch (error) {
    return handleApiError(error);
  }
}
