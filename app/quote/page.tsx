import type { Metadata } from "next";
import { DestinationCarousel } from "@/components/DestinationCarousel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FlightQuoteSection } from "@/components/quote/FlightQuoteSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { parseQuoteQuery, type QuotePageSearchParams } from "@/lib/quoteQuery";
import { getQuotePageSeoSafely, getQuoteSectionsSafely } from "@/services/quote.service";

// The phone bar, testimonials and deals carousel below read their content
// from the database (see services/quote.service.ts) — revalidate
// periodically so edits made in the admin panel appear without a full
// redeploy.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getQuotePageSeoSafely();
  if (!seo) {
    return {
      title: "Get Your Free Quote — MultiCityExperts",
      description:
        "Review your flight search and get free, unpublished business class fares from a MultiCityExperts travel specialist.",
    };
  }
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

interface QuotePageProps {
  searchParams: Promise<QuotePageSearchParams>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const criteria = parseQuoteQuery(await searchParams);
  const sections = await getQuoteSectionsSafely();

  return (
    <>
      <Header />
      <main id="top">
        <FlightQuoteSection
          criteria={criteria}
          summaryImages={sections.QT_SUMMARY?.images}
          phoneNumber={sections.QT_FORM?.phoneNumber}
          agentPhoto={sections.QT_FORM?.agentPhoto}
          trustStats={sections.QT_FORM?.trustStats}
        />
        <TestimonialCarousel
          heading={sections.TESTIMONIALS?.heading ?? "Client Experiences"}
          subheading={sections.TESTIMONIALS?.subheading ?? "Trusted by Discerning Travelers"}
          testimonials={sections.TESTIMONIALS?.testimonials}
          backgroundImage={sections.TESTIMONIALS?.backgroundImage}
        />
        <DestinationCarousel
          heading={sections.QT_DESTINATIONS?.heading}
          subheading={sections.QT_DESTINATIONS?.subheading}
          deals={sections.QT_DESTINATIONS?.deals}
        />
      </main>
      <Footer />
    </>
  );
}
