"use client";

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
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-base font-bold text-sidebar-foreground group-data-[collapsible=icon]:justify-center"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            MC
          </span>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            MultiCity<span className="text-primary">Experts</span>
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
