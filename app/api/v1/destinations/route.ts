import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateSearchParams } from "@/lib/validation";
import { listTopCities, listTopCountries } from "@/services/destination.service";
import { listDestinationsQuerySchema } from "@/validations/destination.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 60;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Public — `type=country` returns the distinct-country rollup ("Top
 * Countries"), `type=city` returns featured destinations ("Top Cities").
 * Only ever reads active/featured rows, so no permission check is needed. */
export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`destinations:list:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const url = new URL(request.url);
    const { type, limit } = validateSearchParams(url.searchParams, listDestinationsQuerySchema);
    const destinations = type === "country" ? await listTopCountries(limit) : await listTopCities(limit);
    return apiSuccess({ destinations });
  } catch (error) {
    return handleApiError(error);
  }
}
