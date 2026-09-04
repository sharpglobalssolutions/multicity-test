import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { idParamSchema, validateJsonBody, validateParams } from "@/lib/validation";
import { completeFormSubmission } from "@/services/form-submission.service";
import { completeFormSubmissionSchema } from "@/validations/form-submission.validation";

export const dynamic = "force-dynamic";

// Public, unauthenticated — the visitor completing step 2 of the flight
// search widget is attaching their contact details to the step-1 record
// they (anonymously) created moments earlier. Same trust model as the
// sibling public POST on `form-submissions/route.ts`: knowing the
// unguessable cuid `id` is the only "authorization" here, same as create.
const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `form-submissions:complete:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const { id } = validateParams(await context.params, idParamSchema);
    const input = await validateJsonBody(request, completeFormSubmissionSchema);
    const submission = await completeFormSubmission(id, input, ip);
    return apiSuccess({ id: submission.id });
  } catch (error) {
    return handleApiError(error);
  }
}
