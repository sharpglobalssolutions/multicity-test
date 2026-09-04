import type { Metadata } from "next";
import { FormSubmissionsListView } from "@/components/admin/form-submissions/FormSubmissionsListView";

export const metadata: Metadata = {
  title: "Form Submissions — MultiCityExperts Admin",
};

export default function AdminFormSubmissionsPage() {
  return <FormSubmissionsListView />;
}
