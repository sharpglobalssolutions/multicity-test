import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/rbac";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { validateJsonBody } from "@/lib/validation";
import { changePassword } from "@/services/auth.service";
import { changePasswordSchema } from "@/validations/auth.validation";

// Reads the session cookie on every request; must never be statically
// cached or served the same result for two different callers.
export const dynamic = "force-dynamic";

const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `change-password:${ip}`,
      RATE_LIMIT,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    const currentUser = await requireAuth();

    const { currentPassword, newPassword } = await validateJsonBody(request, changePasswordSchema);
    await changePassword(currentUser.id, currentPassword, newPassword);

    // The password change just invalidated this session too (along with
    // every other one) — clear the cookie so the browser doesn't keep
    // sending a token that's already dead.
    const response = apiSuccess({ message: "Password changed successfully. Please log in again." });
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
