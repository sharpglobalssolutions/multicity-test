import type { Metadata } from "next";
import { BlogPostCard } from "@/components/BlogPostCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { listFeaturedBlogPosts } from "@/services/blog.service";

export const metadata: Metadata = {
  title: "Travel Insights & Flight Expertise — MultiCityExperts",
  description:
    "Practical guidance for premium international travel, multi-city itineraries and business class planning.",
};

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const posts = await listFeaturedBlogPosts();

  return (
    <>
      <Header />
      <main id="top">
        <section className="bg-off-white py-20 sm:py-28">
          <div className="content-container">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-semibold text-text-dark sm:text-4xl lg:text-[34px]">
                Travel Insights &amp; Flight Expertise
              </h1>
              <p className="mt-4 text-base text-text-gray sm:text-[16px]">
                Practical guidance for premium international travel, multi-city itineraries and business class
                planning.
              </p>
            </div>

            {posts.length === 0 ? (
              <p className="mt-16 text-center text-sm text-text-gray">
                New travel insights are on the way — check back soon.
              </p>
            ) : (
              <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
