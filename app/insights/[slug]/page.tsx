import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetailTemplate } from "@/components/blog/BlogDetailTemplate";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { NotFoundError } from "@/lib/errors";
import { getBlogPostPageData, getBlogPostSeo, getPublishedBlogPostBySlug } from "@/services/blog.service";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function siteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPublishedBlogPostBySlug(slug);
    const seo = await getBlogPostSeo(post.id);

    const title = seo?.seoTitle || `${post.title} — MultiCityExperts`;
    const description = seo?.metaDescription || post.excerpt || undefined;
    const ogTitle = seo?.ogTitle || title;
    const ogDescription = seo?.ogDescription || description;
    const ogImage = seo?.ogImage?.url || post.featured_image || undefined;
    const twitterTitle = seo?.twitterTitle || ogTitle;
    const twitterDescription = seo?.twitterDescription || ogDescription;
    const twitterImage = seo?.twitterImage?.url || ogImage;

    return {
      title,
      description,
      alternates: { canonical: seo?.canonicalUrl || siteUrl(post.url) },
      robots:
        seo && (!seo.robotsIndex || !seo.robotsFollow)
          ? { index: seo.robotsIndex, follow: seo.robotsFollow }
          : undefined,
      openGraph: {
        type: "article",
        title: ogTitle,
        description: ogDescription,
        url: siteUrl(post.url),
        images: ogImage ? [{ url: ogImage }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: twitterTitle,
        description: twitterDescription,
        images: twitterImage ? [twitterImage] : undefined,
      },
    };
  } catch {
    return { title: "Travel Insights — MultiCityExperts" };
  }
}

export default async function InsightArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let data: Awaited<ReturnType<typeof getBlogPostPageData>>;
  try {
    data = await getBlogPostPageData(slug);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const seo = await getBlogPostSeo(data.post.id).catch(() => null);

  return (
    <>
      <JsonLd data={seo?.schemaData} />
      <Header />
      <main id="top">
        <BlogDetailTemplate post={data.post} relatedPosts={data.relatedPosts} faqs={data.faqs} />
      </main>
      <Footer />
    </>
  );
}
