import {
  Building2,
  Globe2,
  LayoutDashboard,
  Newspaper,
  Plane,
  Search,
  Settings,
  ShieldCheck,
  Tag,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Modules aren't built yet (see the "do not build business modules
   * yet" scope for this foundation) — `soon` items render as inert,
   * badge-marked placeholders instead of real links. */
  status: "active" | "soon";
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard, status: "active" },
  { label: "Pages", href: "/admin/pages", icon: Newspaper, status: "active" },
  { label: "Airports", href: "/admin/airports", icon: Building2, status: "soon" },
  { label: "Airlines", href: "/admin/airlines", icon: Plane, status: "soon" },
  { label: "Flight Offers", href: "/admin/offers", icon: Tag, status: "soon" },
  { label: "Blog", href: "/admin/blog", icon: Globe2, status: "soon" },
  { label: "SEO", href: "/admin/seo", icon: Search, status: "soon" },
  { label: "Users & Roles", href: "/admin/users", icon: ShieldCheck, status: "soon" },
  { label: "Settings", href: "/admin/settings", icon: Settings, status: "soon" },
];
