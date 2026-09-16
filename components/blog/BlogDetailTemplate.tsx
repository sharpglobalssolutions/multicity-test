import Image from "next/image";
import { FAQ } from "@/components/FAQ";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { BlogHelpCard } from "@/components/blog/BlogHelpCard";
import { BlogRelatedArticles } from "@/components/blog/BlogRelatedArticles";
import { BlogToc } from "@/components/blog/BlogToc";
import { extractToc, injectHeadingIds } from "@/lib/toc";
import type { PublicBlogPost } from "@/services/blog.service";

const DEFAULT_FEATURED_IMAGE = "/images/plan-img.webp";

export interface BlogDetailTemplateProps {
  post: PublicBlogPost;
  relatedPosts: PublicBlogPost[];
  faqs: { id: string; question: string; answer: string }[];
}

/**
 * The reusable layout behind every blog post detail page — one template,
 * driven entirely by the post's own data (title/excerpt/featured image/
 * content) plus its related posts and FAQs, both fetched independently.
 * No post-specific markup lives here, so a new blog post never needs a
 * code change (mirrors `PolicyPageTemplate`'s "one template, many pages"
 * approach).
 */
export function BlogDetailTemplate({ post, relatedPosts, faqs }: BlogDetailTemplateProps) {
  const toc = extractToc(post.content);

  return (
    <>
      {/* Hero */}
      <section className="bg-off-white pt-28 pb-10 sm:pt-32 sm:pb-12">
        <div className="content-container max-w-4xl text-center">
          <h1 className="text-3xl font-semibold leading-tight text-text-dark sm:text-4xl lg:text-[42px]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-gray sm:text-lg">
              {post.excerpt}
            </p>
          ) : null}
        </div>

        <div className="content-container mt-10">
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl bg-gray-light sm:aspect-[16/8]">
            <Image
              src={post.featured_image || DEFAULT_FEATURED_IMAGE}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Content + sidebar */}
      <section className="bg-white py-16 sm:py-20">
        <div className="content-container grid grid-cols-1 gap-12 lg:grid-cols-[70%_1fr] lg:gap-14">
          <article
            className="blog-article prose prose-neutral max-w-none prose-headings:font-heading prose-headings:font-semibold prose-headings:text-text-dark prose-h2:mt-12 prose-h2:text-xl prose-h3:mt-8 prose-h3:text-lg prose-p:leading-[1.7] prose-p:text-[#666666] prose-a:text-navy-deep prose-a:underline-offset-4 prose-strong:text-text-dark prose-li:text-[#666666] prose-table:text-sm first:prose-h2:mt-0"
            // Content is authored by an RBAC-gated admin through the
            // rich-text editor (components/admin/RichTextEditor.tsx), not
            // public user input — same trust boundary as every other
            // admin-authored HTML field in this app (see
            // `PolicyPageTemplate.tsx`).
            dangerouslySetInnerHTML={{ __html: injectHeadingIds(post.content) }}
          />

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:h-fit">
            <BlogToc items={toc} />
            <BlogHelpCard />
            <BlogRelatedArticles posts={relatedPosts} />
          </aside>
        </div>
      </section>

      {faqs.length > 0 ? <FAQ faqs={faqs} /> : null}

      <ServicesCarousel
        heading="Explore Our Other Services"
        subheading="Whatever's next on your itinerary, our specialists can help you plan it."
      />
    </>
  );
}
