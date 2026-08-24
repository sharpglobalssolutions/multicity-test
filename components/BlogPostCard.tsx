import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PublicBlogPost } from "@/services/blog.service";

const FALLBACK_IMAGE = "/images/plan-img.webp";
const EXCERPT_FALLBACK_LENGTH = 150;

/** Strips the post's raw content down to a plain-text snippet when the
 * backend has no excerpt set, so a card never shows empty space. */
function deriveExcerpt(content: string): string {
  const text = content.replace(/\s+/g, " ").trim();
  if (text.length <= EXCERPT_FALLBACK_LENGTH) return text;
  return `${text.slice(0, EXCERPT_FALLBACK_LENGTH).trimEnd()}…`;
}

export function BlogPostCard({ post }: { post: PublicBlogPost }) {
  const excerpt = post.excerpt?.trim() || deriveExcerpt(post.content);

  return (
    <article className="group">
      <Link href={post.url} className="block overflow-hidden rounded-2xl" tabIndex={-1}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-light">
          <Image
            src={post.featured_image || FALLBACK_IMAGE}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </Link>
      <h3 className="mt-5 line-clamp-2 text-lg font-semibold leading-snug text-text-dark">
        <Link href={post.url}>{post.title}</Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-gray">{excerpt}</p>
      <Link
        href={post.url}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-deep transition-colors hover:text-emerald"
      >
        Read More
        <ChevronRight size={14} aria-hidden="true" />
      </Link>
    </article>
  );
}
