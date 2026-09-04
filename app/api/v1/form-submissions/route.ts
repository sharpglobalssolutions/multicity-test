import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { validateJsonBody, validateSearchParams } from "@/lib/validation";
import { listFormSubmissionsForAdmin, submitForm } from "@/services/form-submission.service";
import { createFormSubmissionSchema, listFormSubmissionsQuerySchema } from "@/validations/form-submission.validation";

export const dynamic = "force-dynamic";

// Public, unauthenticated endpoint (contact/quote-request forms on the
// marketing site have no logged-in user) — rate-limited by IP, same as
// the other public write endpoint (auth/forgot-password), as the only
// line of defense against spam/abuse.
const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

// Admin-only — GET lists every submission (including step-1-only leads
// with no contact info yet), unlike the public POST below.
export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `form-submissions:list:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    await requirePermission("form-submissions.read");
    const url = new URL(request.url);
    const query = validateSearchParams(url.searchParams, listFormSubmissionsQuerySchema);
    const { items, pagination } = await listFormSubmissionsForAdmin(query);
    return apiSuccess({ submissions: items }, { meta: { pagination } });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `form-submissions:create:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const input = await validateJsonBody(request, createFormSubmissionSchema);
    const userAgent = request.headers.get("user-agent");
    const submission = await submitForm(input, ip, userAgent);
    return apiSuccess({ id: submission.id }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
