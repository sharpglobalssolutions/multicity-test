import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSessionUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

/** Already signed in? Skip the login form and go straight to the panel —
 * mirrors the guard in `(protected)/layout.tsx` from the other direction. */
export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <LoginForm />
    </div>
  );
}
