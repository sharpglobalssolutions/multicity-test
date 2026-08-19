import type { Metadata } from "next";
import { PageForm } from "@/components/admin/pages/PageForm";

export const metadata: Metadata = {
  title: "Edit Page — MultiCityExperts Admin",
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPagePage({ params }: EditPageProps) {
  const { id } = await params;
  return <PageForm mode="edit" pageId={id} />;
}
