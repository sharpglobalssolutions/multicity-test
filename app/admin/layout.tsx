import type { Metadata } from "next";
import { AdminThemeScope } from "@/components/admin/AdminThemeScope";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Admin — MultiCityExperts",
  description: "MultiCityExperts admin panel.",
};

/**
 * Shared by both the public `/admin/login` page and every route under
 * `(protected)` — theme scoping and providers only. The actual auth gate
 * and sidebar shell live in `(protected)/layout.tsx`, not here, so the
 * login page itself isn't caught behind the check it exists to satisfy.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-theme">
      <AdminThemeScope />
      <TooltipProvider delay={200}>
        {children}
        <Toaster position="top-right" />
      </TooltipProvider>
    </div>
  );
}
