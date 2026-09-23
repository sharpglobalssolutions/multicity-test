import type { Metadata } from "next";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export const metadata: Metadata = {
  title: "Edit Blog Post — MultiCityExperts Admin",
};

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  return <BlogPostForm mode="edit" postId={id} />;
}
