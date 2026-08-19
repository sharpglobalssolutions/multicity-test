import type { Metadata } from "next";
import { PagesListView } from "@/components/admin/pages/PagesListView";

export const metadata: Metadata = {
  title: "Pages — MultiCityExperts Admin",
};

export default function AdminPagesListPage() {
  return <PagesListView />;
}
