import type { Metadata } from "next";
import { DestinationCarousel } from "@/components/DestinationCarousel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FlightQuoteSection } from "@/components/quote/FlightQuoteSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { parseQuoteQuery, type QuotePageSearchParams } from "@/lib/quoteQuery";

export const metadata: Metadata = {
  title: "Get Your Free Quote — MultiCityExperts",
  description:
    "Review your flight search and get free, unpublished business class fares from a MultiCityExperts travel specialist.",
};

interface QuotePageProps {
  searchParams: Promise<QuotePageSearchParams>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const criteria = parseQuoteQuery(await searchParams);

  return (
    <>
      <Header />
      <main id="top">
        <FlightQuoteSection criteria={criteria} />
        <TestimonialCarousel heading="Client Experiences" subheading="Trusted by Discerning Travelers" />
        <DestinationCarousel />
      </main>
      <Footer />
    </>
  );
}
