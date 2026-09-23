import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { listBlogCategoriesForAdmin } from "@/services/blog.service";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 60;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Admin-only — existing category names, so the blog post form can
 * suggest them instead of every post typing a fresh one that differs by a
 * capital letter. There's no create/update/delete here: categories are
 * only ever created implicitly, by naming one on a post (see
 * `repositories/blog-category.repository.ts`). */
export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`blog:categories:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    await requirePermission("blog.read");
    const categories = await listBlogCategoriesForAdmin();
    return apiSuccess({ categories });
  } catch (error) {
    return handleApiError(error);
  }
}
