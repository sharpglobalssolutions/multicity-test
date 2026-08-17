import { NotFoundError } from "@/lib/errors";
import { findBlogPostById, publishBlogPost } from "@/repositories/blog-post.repository";

export async function publishExistingBlogPost(id: string) {
  const post = await findBlogPostById(id);
  if (!post) {
    throw new NotFoundError("Blog post not found");
  }
  return publishBlogPost(id);
}
