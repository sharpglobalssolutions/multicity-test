import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NotFoundError } from "@/lib/errors";
import { getPublishedBlogPostBySlug } from "@/services/blog.service";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPostOr404(slug: string) {
  try {
    return await getPublishedBlogPostBySlug(slug);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPublishedBlogPostBySlug(slug);
    return {
      title: `${post.title} — MultiCityExperts`,
      description: post.excerpt ?? undefined,
    };
  } catch {
    return { title: "Travel Insights — MultiCityExperts" };
  }
}

export default async function InsightArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostOr404(slug);

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <>
      <Header />
      <main id="top">
        <article className="bg-off-white py-16 sm:py-20">
          <div className="content-container max-w-3xl">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1 text-sm font-semibold text-navy-deep transition-colors hover:text-emerald"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              All Articles
            </Link>

            <h1 className="mt-6 text-3xl font-semibold leading-tight text-text-dark sm:text-4xl lg:text-[38px]">
              {post.title}
            </h1>
            {publishedDate ? <p className="mt-3 text-sm text-text-gray">{publishedDate}</p> : null}

            {post.featured_image ? (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-light">
                <Image src={post.featured_image} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
              </div>
            ) : null}

            <div className="mt-10 whitespace-pre-wrap text-base leading-relaxed text-text-dark/90">
              {post.content}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
