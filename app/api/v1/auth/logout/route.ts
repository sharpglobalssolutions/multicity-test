import { cookies } from "next/headers";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/handle-error";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { logout } from "@/services/auth.service";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    // Invalidates the token server-side (via User.tokenVersion) before
    // clearing the cookie, so the old token is dead even if it was
    // copied elsewhere and the cookie-clear never reaches this browser.
    await logout(token);

    const response = apiSuccess({ loggedOut: true });
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
