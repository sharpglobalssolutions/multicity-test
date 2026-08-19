import type { Metadata } from "next";
import { PageForm } from "@/components/admin/pages/PageForm";

export const metadata: Metadata = {
  title: "Create Page — MultiCityExperts Admin",
};

export default function AdminCreatePagePage() {
  return <PageForm mode="create" />;
}
