import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { validateJsonBody, validateSearchParams } from "@/lib/validation";
import { createNewAirline, listTopAirlines } from "@/services/airline.service";
import { createAirlineSchema, listAirlinesQuerySchema } from "@/validations/airline.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Public — returns only featured/active airlines, so no permission check
 * is needed (unlike POST below, which is the admin create endpoint). */
export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`airlines:list:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const url = new URL(request.url);
    const { limit } = validateSearchParams(url.searchParams, listAirlinesQuerySchema);
    const airlines = await listTopAirlines(limit);
    return apiSuccess({ airlines });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`airlines:create:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    await requirePermission("airlines.create");
    const input = await validateJsonBody(request, createAirlineSchema);
    const airline = await createNewAirline(input);
    return apiSuccess({ airline }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
