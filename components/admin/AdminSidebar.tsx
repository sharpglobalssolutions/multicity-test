"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ADMIN_NAV_ITEMS } from "@/data/admin-nav";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader>
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 group-data-[collapsible=icon]:justify-center"
        >
          {/* The square "MC" mark is the icon-only fallback for the
              collapsed sidebar — the site has no separate compact mark, so
              this stays a stylized monogram rather than squeezing the real
              (wide, wordmark-shaped) logo into that narrow space. Shown only
              when collapsed, so the expanded header isn't showing both a
              monogram and the real logo side by side. */}
          <span className="hidden size-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground group-data-[collapsible=icon]:flex">
            MC
          </span>
          <span className="relative h-7 w-[130px] shrink-0 group-data-[collapsible=icon]:hidden">
            <Image src="/logo/logo-white.webp" alt="MultiCityExperts" fill sizes="130px" className="object-contain object-left" />
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.status === "active" && pathname === item.href;

                if (item.status === "soon") {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton disabled tooltip={`${item.label} — coming soon`}>
                        <Icon />
                        <span>{item.label}</span>
                        <Badge
                          variant="secondary"
                          className="ml-auto shrink-0 text-[10px] group-data-[collapsible=icon]:hidden"
                        >
                          Soon
                        </Badge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <p className="px-2 py-1.5 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
          Admin foundation v0.1
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
