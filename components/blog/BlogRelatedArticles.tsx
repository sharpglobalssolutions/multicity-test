import Link from "next/link";
import type { PublicBlogPost } from "@/services/blog.service";

function formatDate(value: Date | string | null): string | null {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export interface BlogRelatedArticlesProps {
  posts: PublicBlogPost[];
}

/** Related-articles sidebar card — `posts` comes from
 * `getBlogPostPageData` (same-category posts first, falling back to the
 * most recent others), never hardcoded. Renders nothing if there are no
 * other published posts to show. */
export function BlogRelatedArticles({ posts }: BlogRelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <div className="rounded-card border border-navy-deep/10 bg-white p-5 shadow-card">
      <p className="text-sm font-semibold text-text-dark">Related Articles</p>
      <ul className="mt-3 divide-y divide-navy-deep/10">
        {posts.map((post) => {
          const date = formatDate(post.published_at);
          return (
            <li key={post.id} className="py-3 first:pt-0 last:pb-0">
              <Link href={post.url} className="group block">
                <p className="text-sm font-medium leading-snug text-text-dark transition-colors group-hover:text-emerald">
                  {post.title}
                </p>
                {post.category || date ? (
                  <p className="mt-1 text-xs text-text-gray">
                    {post.category?.name}
                    {post.category && date ? " · " : ""}
                    {date}
                  </p>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
