import { Suspense } from "react";
import Link from "next/link";
import { BlogPostCard } from "@/components/BlogPostCard";
import { listFeaturedBlogPosts } from "@/services/blog.service";

const FEATURED_COUNT = 3;

function InsightsGridSkeleton() {
  return (
    <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: FEATURED_COUNT }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[4/3] rounded-2xl bg-navy-deep/[0.06]" />
          <div className="mt-5 h-5 w-4/5 rounded bg-navy-deep/[0.06]" />
          <div className="mt-3 h-4 w-full rounded bg-navy-deep/[0.06]" />
          <div className="mt-2 h-4 w-2/3 rounded bg-navy-deep/[0.06]" />
        </div>
      ))}
    </div>
  );
}

async function InsightsGrid() {
  const posts = await listFeaturedBlogPosts(FEATURED_COUNT);

  if (posts.length === 0) {
    return (
      <p className="mt-16 text-center text-sm text-text-gray">
        New travel insights are on the way — check back soon.
      </p>
    );
  }

  return (
    <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export interface TravelInsightsProps {
  heading?: string;
  subheading?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. The article list itself stays blog-driven
 * (unrelated to this — it always reflects the live `BlogPost` table). */
export function TravelInsights({
  heading = "Travel Insights & Flight Expertise",
  subheading = "Practical guidance for premium international travel, multi-city itineraries and business class planning.",
}: TravelInsightsProps = {}) {
  return (
    <section id="insights" className="relative overflow-hidden bg-off-white py-20 sm:py-20">
      {/* Decorative oversized word, bottom-left — Playfair Display, purely
          a background motif, kept behind all content. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -left-2 select-none font-playfair text-[110px] font-normal leading-none text-navy-deep/[0.05] sm:-bottom-12 sm:text-[170px] lg:-bottom-16 lg:text-[220px]"
      >
        Insights
      </span>

      <div className="content-container relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl  text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <div className="mt-4 text-base text-text-gray sm:text-[16px]" dangerouslySetInnerHTML={{ __html: subheading }} />
        </div>

        <Suspense fallback={<InsightsGridSkeleton />}>
          <InsightsGrid />
        </Suspense>

        <div className="mt-12 flex justify-center lg:justify-end">
          <Link
            href="/insights"
            className="inline-flex items-center rounded-full bg-navy-deep px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
