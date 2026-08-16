import { apiSuccess } from "@/lib/api-response";
import { RateLimitError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session";
import { validateJsonBody } from "@/lib/validation";
import { login } from "@/services/auth.service";
import { loginSchema } from "@/validations/auth.validation";

/** Generic per-IP volume throttle — distinct from, and in addition to,
 * the per-account lockout in services/auth.service.ts. This one catches
 * a single source hammering the endpoint (regardless of which email it's
 * targeting); the lockout catches one account being targeted from many
 * sources. Neither replaces the other. */
const LOGIN_RATE_LIMIT = 10;
const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(
      `login:${ip}`,
      LOGIN_RATE_LIMIT,
      LOGIN_RATE_LIMIT_WINDOW_MS,
    );
    if (!allowed) {
      throw new RateLimitError("Too many login attempts. Please try again later.", retryAfterSeconds);
    }

    const { email, password } = await validateJsonBody(request, loginSchema);
    const { user, sessionToken } = await login(email, password);

    const response = apiSuccess({ user });
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
