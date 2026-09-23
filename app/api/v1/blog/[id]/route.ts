import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSessionUser, requirePermission } from "@/lib/rbac";
import { idParamSchema, validateJsonBody, validateParams } from "@/lib/validation";
import { deleteBlogPostById, getBlogPostByIdOrSlugForViewer, updateBlogPostForUser } from "@/services/blog.service";
import { updateBlogPostSchema } from "@/validations/blog.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 60;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RouteContext {
  params: Promise<{ id: string }>;
}

// This route's dynamic segment accepts either the post's cuid `id` (what
// the admin edit UI has) or its `slug` (what a public article-page caller
// has) — tried in that order by `getBlogPostByIdOrSlugForViewer`, same
// dual-purpose lookup `app/api/v1/pages/[id]/route.ts` uses. A viewer
// without `blog.read` only ever sees PUBLISHED posts. Kept as one segment
// named `id` since Next.js requires every handler sharing this path
// position to use the same param name (see `[id]/publish` and
// `[id]/unpublish`).
export async function GET(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`blog:get:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const { id: idOrSlug } = validateParams(await context.params, idParamSchema);
    const viewer = await getSessionUser();
    const post = await getBlogPostByIdOrSlugForViewer(idOrSlug, viewer);
    return apiSuccess({ post });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`blog:update:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("blog.update");
    const { id } = validateParams(await context.params, idParamSchema);
    const input = await validateJsonBody(request, updateBlogPostSchema);
    const post = await updateBlogPostForUser(id, input, user.id, ip);
    return apiSuccess({ post });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`blog:delete:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("blog.delete");
    const { id } = validateParams(await context.params, idParamSchema);
    await deleteBlogPostById(id, user.id, ip);
    return apiSuccess({ message: "Blog post deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
