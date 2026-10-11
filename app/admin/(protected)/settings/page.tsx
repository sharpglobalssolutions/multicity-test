import type { Metadata } from "next";
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";

export const metadata: Metadata = {
  title: "Settings — MultiCityExperts Admin",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Site-wide configuration that isn&apos;t tied to a specific page.</p>
      </div>
      <SiteSettingsForm />
    </div>
  );
}
