import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { validateJsonBody } from "@/lib/validation";
import { createNewFlightOffer } from "@/services/flight-offer.service";
import { createFlightOfferSchema } from "@/validations/offer.validation";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`offers:create:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    await requirePermission("offers.create");
    const input = await validateJsonBody(request, createFlightOfferSchema);
    const offer = await createNewFlightOffer(input);
    return apiSuccess({ offer }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
