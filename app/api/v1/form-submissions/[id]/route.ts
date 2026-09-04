import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { idParamSchema, validateJsonBody, validateParams } from "@/lib/validation";
import { getFormSubmissionByIdForUser, updateFormSubmissionStatusForUser } from "@/services/form-submission.service";
import { updateFormSubmissionStatusSchema } from "@/validations/form-submission.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `form-submissions:detail:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    await requirePermission("form-submissions.read");
    const { id } = validateParams(await context.params, idParamSchema);
    const submission = await getFormSubmissionByIdForUser(id);
    return apiSuccess({ submission });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `form-submissions:update:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const user = await requirePermission("form-submissions.update");
    const { id } = validateParams(await context.params, idParamSchema);
    const input = await validateJsonBody(request, updateFormSubmissionStatusSchema);
    const submission = await updateFormSubmissionStatusForUser(id, input.status, user.id, ip);
    return apiSuccess({ submission });
  } catch (error) {
    return handleApiError(error);
  }
}
