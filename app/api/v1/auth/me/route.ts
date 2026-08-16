import { cookies } from "next/headers";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/handle-error";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { getCurrentUser } from "@/services/auth.service";

// Reads the session cookie on every request; must never be statically
// cached or served the same result for two different visitors.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const user = await getCurrentUser(token);
    return apiSuccess({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
