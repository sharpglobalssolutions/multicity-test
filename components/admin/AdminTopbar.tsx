"use client";

import { usePathname } from "next/navigation";
import { AdminBreadcrumbs, type BreadcrumbSegment } from "@/components/admin/AdminBreadcrumbs";
import { UserMenu } from "@/components/admin/UserMenu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ADMIN_NAV_ITEMS } from "@/data/admin-nav";

/** Derives the current breadcrumb trail from the pathname against the
 * nav item list, so every present/future admin page gets a correct
 * breadcrumb without having to pass one down manually. */
const HOME_HREF = ADMIN_NAV_ITEMS[0]?.href ?? "/admin/dashboard";

/** Matches by longest-prefix rather than exact equality, so a nested route
 * like `/admin/pages/create` or `/admin/pages/[id]/edit` still resolves to
 * the "Pages" nav item instead of falling back to a bare "Admin" crumb. */
function useBreadcrumbs(): BreadcrumbSegment[] {
  const pathname = usePathname();
  const current = ADMIN_NAV_ITEMS.filter(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  ).sort((a, b) => b.href.length - a.href.length)[0];

  if (!current || current.href === HOME_HREF) {
    return [{ label: "Admin" }];
  }

  return [{ label: "Admin", href: HOME_HREF }, { label: current.label }];
}

/** Sticky top navigation bar: mobile/desktop sidebar toggle, breadcrumb
 * for the current page, and the user menu. */
export function AdminTopbar() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-5" />
      <div className="min-w-0 flex-1">
        <AdminBreadcrumbs items={breadcrumbs} />
      </div>
      <UserMenu />
    </header>
  );
}
