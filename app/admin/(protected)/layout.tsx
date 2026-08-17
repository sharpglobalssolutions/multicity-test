import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSessionUser } from "@/lib/rbac";

// Reads the session cookie on every request; must never be statically
// cached or served the same result for two different visitors.
export const dynamic = "force-dynamic";

/**
 * Every route under this group requires a live session — this is the
 * actual access gate for the admin panel. Unauthenticated visitors never
 * receive any of the protected markup below; `redirect()` runs during the
 * server render, before `children` is ever rendered, so nothing here can
 * leak to a signed-out browser (unlike a client-side redirect, which
 * would have to ship the protected page first and redirect afterward).
 *
 * `/admin/login` deliberately lives *outside* this group (a sibling under
 * `app/admin/`), so it isn't gated behind the very check it exists to
 * satisfy — that would be a permanent redirect loop.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminTopbar />
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
