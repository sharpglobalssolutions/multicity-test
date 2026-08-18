import { redirect } from "next/navigation";
import { LoginBrandPanel } from "@/components/admin/LoginBrandPanel";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSessionUser } from "@/lib/rbac";

export const dynamic = "force-dynamic";

/** Already signed in? Skip the login form and go straight to the panel —
 * mirrors the guard in `(protected)/layout.tsx` from the other direction. */
export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-svh w-full bg-background">
      <LoginBrandPanel />
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}
