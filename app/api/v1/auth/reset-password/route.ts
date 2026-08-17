import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateJsonBody } from "@/lib/validation";
import { resetPassword } from "@/services/auth.service";
import { resetPasswordSchema } from "@/validations/auth.validation";

const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `reset-password:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const { token, newPassword } = await validateJsonBody(request, resetPasswordSchema);
    await resetPassword(token, newPassword);

    return apiSuccess({
      message: "Password has been reset successfully. Please log in with your new password.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
