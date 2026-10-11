import type { Metadata } from "next";
import { ComplexitySection } from "@/components/multi-city/ComplexitySection";
import { ExpertGuidanceSection } from "@/components/multi-city/ExpertGuidanceSection";
import { ExploreEuropeSection } from "@/components/multi-city/ExploreEuropeSection";
import { FeaturedBlockSection } from "@/components/multi-city/FeaturedBlockSection";
import { FlightOptionCards } from "@/components/multi-city/FlightOptionCards";
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { MultiCityHero } from "@/components/multi-city/MultiCityHero";
import { PlanningFactorsSection } from "@/components/multi-city/PlanningFactorsSection";
import { PopularRoutesSection } from "@/components/multi-city/PopularRoutesSection";
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { WorkAroundYouSection } from "@/components/multi-city/WorkAroundYouSection";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import type { Faq } from "@/data/content";
import { unsplash } from "@/lib/images";
import {
  getMultiCityFlightsPageSeoSafely,
  getMultiCityFlightsSectionsSafely,
} from "@/services/multi-city-flights.service";

// Every section below reads its content from the database (see
// services/multi-city-flights.service.ts) — revalidate periodically so
// edits made in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA`/`FAQ` section types —
 * those components' own built-in defaults are homepage copy, so without
 * this, a missing section here would silently show homepage content
 * instead of this page's copy. Same pattern `app/business-class/page.tsx`
 * uses. */
const DEFAULT_CTA = {
  heading: "Your Multi-City Journey Starts Here",
  body: "Speak with a multi-city specialist and explore the routes, airlines and stopovers that fit the way you want to travel.",
  buttonLabel: "Speak With a Multi-City Travel Expert",
  buttonHref: "#connect",
  backgroundImage: unsplash("1500835556837-99ac94a94552"),
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "different-from-booking-sites",
    question: "What makes MultiCityExperts different from booking sites?",
    answer:
      "Booking sites search flights in isolation. We plan the full journey — routing, connections, cabin and fare rules across every leg — with a specialist you can actually talk to.",
  },
  {
    id: "multi-city-open-jaw",
    question: "What is a multi-city or open-jaw itinerary?",
    answer:
      "A multi-city itinerary visits several destinations in one trip rather than a simple round trip. An open-jaw itinerary flies into one city and home from another, skipping backtracking.",
  },
  {
    id: "routes-specialize",
    question: "Which routes do you specialize in?",
    answer:
      "Our core expertise is North Atlantic routing — the USA and Canada to major European cities — though we regularly plan itineraries well beyond that as well.",
  },
  {
    id: "economy-or-business",
    question: "Do you book economy or only business class?",
    answer: "Both. We work across Economy, Premium Economy and Business Class, based on what fits your trip and budget.",
  },
  {
    id: "plans-change",
    question: "What if my plans change after booking?",
    answer:
      "It depends on the fare rules attached to your ticket. We flag flexibility upfront when it matters, and help you navigate changes if your plans shift.",
  },
];
const DEFAULT_FAQ_SECTION = { eyebrow: "Common Questions", heading: "Everything You Need to Know", faqs: DEFAULT_FAQS };

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getMultiCityFlightsPageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function MultiCityFlightsPage() {
  const sections = await getMultiCityFlightsSectionsSafely();
  const seo = await getMultiCityFlightsPageSeoSafely();

  const featuredOne = sections.MC_FEATURED_ONE;
  const featuredTwo = sections.MC_FEATURED_TWO;
  const planningCta = sections.MC_PLANNING_CTA;

  return (
    <>
      <JsonLd data={seo?.schemaData} />
      <Header />
      <main id="top">
        <MultiCityHero {...sections.MC_HERO} />
        <ExpertGuidanceSection {...sections.MC_EXPERT_GUIDANCE} />
        <FlightOptionCards {...sections.MC_FLIGHT_OPTIONS} />
        <ComplexitySection {...sections.MC_COMPLEXITY} />
        <PlanningFactorsSection {...sections.MC_PLANNING_FACTORS} />
        <HowItWorksCarousel {...sections.MC_HOW_IT_WORKS} />
        <WorkAroundYouSection {...sections.MC_WORK_AROUND_YOU} />
        <FeaturedBlockSection
          headingLines={featuredOne?.headingLines ?? ["Business Class", "Multi-City Travel"]}
          body={
            featuredOne?.body ??
            "Travelling between several European cities in Business Class can involve different airlines, routes, schedules and fare structures."
          }
          images={
            featuredOne?.images ?? [
              { src: unsplash("1569154941061-e231b4725ef1"), alt: "A passenger's premium business class seat and workspace in flight" },
              { src: unsplash("1587019158091-1a103c5dd17f"), alt: "Close-up detail of a first-class seat and personal suite" },
            ]
          }
          twoColumnItems={
            featuredOne?.twoColumnItems ?? [
              ["Flexible fares", "Refundable fares", "Business Class", "Premium Economy"],
              ["Mixed-cabin itineraries", "Multiple-airline combinations", "One-way combinations", "Open-jaw options"],
            ]
          }
          buttonLabel={featuredOne?.buttonLabel ?? "Plan My Business Class Journey"}
          buttonHref={featuredOne?.buttonHref ?? "#connect"}
          imagePosition="left"
        />
        <FeaturedBlockSection
          headingLines={featuredTwo?.headingLines ?? ["Flexible Options for", "Complex European Trips"]}
          body={featuredTwo?.body ?? "Depending on your route and available fares, you may be able to explore:"}
          images={
            featuredTwo?.images ?? [
              { src: unsplash("1502602898657-3e91760cbb34"), alt: "The Eiffel Tower rising above the rooftops of Paris at dusk" },
              { src: unsplash("1513635269975-59663e0ac1ad"), alt: "The Elizabeth Tower and Houses of Parliament in London" },
            ]
          }
          twoColumnItems={
            featuredTwo?.twoColumnItems ?? [
              ["Flexible fares", "Refundable fares", "Business Class", "Premium Economy"],
              ["Mixed-cabin itineraries", "Multiple-airline combinations", "One-way combinations", "Open-jaw options"],
            ]
          }
          buttonLabel={featuredTwo?.buttonLabel ?? "Compare My Travel Options"}
          buttonHref={featuredTwo?.buttonHref ?? "#connect"}
          imagePosition="right"
        />
        <PopularRoutesSection {...sections.MC_ROUTES} />
        <ExploreEuropeSection {...sections.MC_EXPLORE_EUROPE} />
        <WhyChooseSection {...sections.MC_WHY_CHOOSE} />
        <FeaturedBlockSection
          headingLines={planningCta?.headingLines ?? ["What We Need to", "Start Planning"]}
          body={planningCta?.body ?? "You don't need to have your entire itinerary figured out. Start with the basics."}
          images={
            planningCta?.images ?? [
              {
                src: unsplash("1573497491208-6b1acb260507"),
                alt: "A professional travel advisor smiling while assisting a client over a headset",
              },
              {
                src: unsplash("1714079761488-e0c9b9ac4138"),
                alt: "A friendly travel support specialist wearing a headset",
              },
            ]
          }
          twoColumnItems={
            planningCta?.twoColumnItems ?? [
              ["Departure city", "Destinations you're considering", "Approximate travel dates", "Trip duration", "Preferred arrival or departure city"],
              ["Cabin preference", "Number of travellers", "Preferred airline, if any", "Flexible dates, if applicable", "Any special requirements"],
            ]
          }
          buttonLabel={planningCta?.buttonLabel ?? "Start My Itinerary"}
          buttonHref={planningCta?.buttonHref ?? "#connect"}
          imagePosition="left"
        />
        <FAQ {...(sections.FAQ ?? DEFAULT_FAQ_SECTION)} />
        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} />
      </main>
      <Footer />
    </>
  );
}
