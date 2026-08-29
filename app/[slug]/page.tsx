import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PolicyPageTemplate } from "@/components/PolicyPageTemplate";
import { NotFoundError } from "@/lib/errors";
import { listActiveSectionsForPage } from "@/services/page-section.service";
import { getPageByIdOrSlugForViewer } from "@/services/page.service";
import { getPageSeo } from "@/services/seo-metadata.service";
import type { PolicyContentSectionData } from "@/types/page-sections";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPublishedPageOr404(slug: string) {
  try {
    return await getPageByIdOrSlugForViewer(slug, null);
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
    const page = await getPageByIdOrSlugForViewer(slug, null);
    const seo = await getPageSeo(page.id);
    return {
      title: seo?.seoTitle || `${page.title} — MultiCityExperts`,
      description: seo?.metaDescription ?? undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Public catch-all for any admin-created `Page` that isn't the homepage —
 * currently only the "policy" template is rendered here. Next resolves
 * static routes (`/insights`, `/admin`, `/api`, `/about`, ...) before ever
 * falling through to this dynamic segment, and `createPageSchema`'s
 * reserved-slug list keeps a new page from being created with a
 * colliding slug in the first place.
 */
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPublishedPageOr404(slug);

  if (page.template !== "policy") {
    notFound();
  }

  const sections = await listActiveSectionsForPage(page.id);
  const policySection = sections.find((section) => section.sectionType === "POLICY_CONTENT");
  if (!policySection) {
    notFound();
  }

  const data = policySection.data as unknown as PolicyContentSectionData;

  return (
    <>
      <Header />
      <main id="top">
        <PolicyPageTemplate
          title={page.title}
          subtitle={data.subtitle}
          bannerImage={data.bannerImage}
          content={data.content ?? ""}
        />
      </main>
      <Footer />
    </>
  );
}
