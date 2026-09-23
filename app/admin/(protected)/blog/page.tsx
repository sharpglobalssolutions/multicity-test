import type { Metadata } from "next";
import { BlogPostsListView } from "@/components/admin/blog/BlogPostsListView";

export const metadata: Metadata = {
  title: "Blog — MultiCityExperts Admin",
};

export default function AdminBlogListPage() {
  return <BlogPostsListView />;
}
