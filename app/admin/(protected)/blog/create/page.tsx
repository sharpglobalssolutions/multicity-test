import type { Metadata } from "next";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export const metadata: Metadata = {
  title: "Add Blog Post — MultiCityExperts Admin",
};

export default function AdminCreateBlogPostPage() {
  return <BlogPostForm mode="create" />;
}
