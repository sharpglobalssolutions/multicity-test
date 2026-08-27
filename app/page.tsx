import type { Metadata } from "next";
import { BusinessClassSection } from "@/components/BusinessClassSection";
import { DestinationCarousel } from "@/components/DestinationCarousel";
import { ExpertsSection } from "@/components/ExpertsSection";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PartnerStrip } from "@/components/PartnerStrip";
import { PersonalizedJourney } from "@/components/PersonalizedJourney";
import { RoutesCarousel } from "@/components/RoutesCarousel";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { Statistics } from "@/components/Statistics";
import { SupportSection } from "@/components/SupportSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { TravelAdvisorSection } from "@/components/TravelAdvisorSection";
import { TravelInsights } from "@/components/TravelInsights";
import { getHomePageSeoSafely, getHomeSectionsSafely } from "@/services/home.service";

// The page is otherwise fully static, but TravelInsights reads live blog
// posts, and every section below now reads its content from the database
// (see services/home.service.ts) — revalidate periodically so edits made
// in the admin panel appear without a full redeploy.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomePageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function Home() {
  const sections = await getHomeSectionsSafely();

  return (
    <>
      <Header />
      <main id="top">
        <Hero {...sections.HERO} />
        <PartnerStrip {...sections.PARTNER_STRIP} />
        <DestinationCarousel {...sections.DEALS} />
        <BusinessClassSection {...sections.BUSINESS_CLASS} />
        <PersonalizedJourney {...sections.PERSONALIZED_JOURNEY} />
        <Statistics {...sections.STATISTICS} />
        <TravelAdvisorSection {...sections.TRAVEL_ADVISOR} />
        <ServicesCarousel {...sections.SERVICES} />
        <SupportSection {...sections.SUPPORT} />
        <ExpertsSection {...sections.EXPERTS} />
        <TestimonialCarousel {...sections.TESTIMONIALS} />
        <FAQ {...sections.FAQ} />
        <TravelInsights {...sections.INSIGHTS} />
        <RoutesCarousel {...sections.ROUTES} />
        <FinalCTA {...sections.CTA} />
      </main>
      <Footer />
    </>
  );
}
