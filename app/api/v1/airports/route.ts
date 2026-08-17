import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { validateJsonBody } from "@/lib/validation";
import { createNewAirport } from "@/services/airport.service";
import { createAirportSchema } from "@/validations/airport.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`airports:create:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    await requirePermission("airports.create");
    const input = await validateJsonBody(request, createAirportSchema);
    const airport = await createNewAirport(input);
    return apiSuccess({ airport }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
