import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateJsonBody } from "@/lib/validation";
import { forgotPassword } from "@/services/auth.service";
import { forgotPasswordSchema } from "@/validations/auth.validation";

/** Bounds how often this can be hit — not to stop guessing (the response
 * never reveals anything either way), but to stop the endpoint being used
 * to spam a target's inbox or otherwise abuse it at volume. */
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `forgot-password:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const { email } = await validateJsonBody(request, forgotPasswordSchema);
    await forgotPassword(email);

    // Identical response whether or not the email is registered —
    // forgotPassword() itself never reveals this either.
    return apiSuccess({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
