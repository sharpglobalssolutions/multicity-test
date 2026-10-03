import type { Metadata } from "next";
import { FeaturedBlockSection } from "@/components/multi-city/FeaturedBlockSection";
// This page's hero and "how it works" steps reuse the Multi-City Flights
// page's components directly (see each one's own doc comment) — both are
// generic enough (no multi-city-specific copy baked into their JSX, only
// into their default props) that building near-identical ones here would
// just be duplication.
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { MultiCityHero } from "@/components/multi-city/MultiCityHero";
import { PlanningFactorsSection } from "@/components/multi-city/PlanningFactorsSection";
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { ExpertGuidanceSection } from "@/components/multi-city/ExpertGuidanceSection";
import { FirstClassAircraftSection } from "@/components/first-class/FirstClassAircraftSection";
import { FirstClassAirlinesCarousel } from "@/components/first-class/FirstClassAirlinesCarousel";
import { FirstClassCabinSection } from "@/components/first-class/FirstClassCabinSection";
import { FirstClassCenteredCta } from "@/components/first-class/FirstClassCenteredCta";
import { FirstClassComparisonSection } from "@/components/first-class/FirstClassComparisonSection";
import { FirstClassFareSection } from "@/components/first-class/FirstClassFareSection";
import { FirstClassOptionsCarousel } from "@/components/first-class/FirstClassOptionsCarousel";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RoutesCarousel } from "@/components/RoutesCarousel";
import { unsplash } from "@/lib/images";
import { getFirstClassPageSeoSafely, getFirstClassSectionsSafely } from "@/services/first-class.service";
import type { FcRouteDeal } from "@/types/page-sections";

// Every section below reads its content from the database (see
// services/first-class.service.ts) — revalidate periodically so edits made
// in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA` section type — `FinalCTA`'s
 * own built-in default is homepage copy, so without this, a missing section
 * here would silently show homepage content instead of this page's copy.
 * Same pattern `app/business-class/page.tsx`/`app/multi-city-flights/page.tsx`
 * use. */
const DEFAULT_CTA = {
  heading: "First Class Should Fit Your Journey, Not Just Your Budget",
  body: "We'll help you explore suitable First Class flights, international routes, airlines, aircraft and fare options so you can make a more informed travel decision.",
  buttonLabel: "Speak With a First Class Travel Specialist",
  buttonHref: "#connect",
  backgroundImage: unsplash("1474302770737-173ee21bab63"),
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getFirstClassPageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function FirstClassPage() {
  const sections = await getFirstClassSectionsSafely();

  const flightSearchChallenge = sections.FC_FLIGHT_SEARCH_CHALLENGE;
  const beforeBooking = sections.FC_BEFORE_BOOKING;
  const boardingExperience = sections.FC_BOARDING_EXPERIENCE;
  const journeyPreferences = sections.FC_JOURNEY_PREFERENCES;
  const fcRoutes: FcRouteDeal[] = sections.FC_ROUTES?.routes ?? [
    {
      id: "new-york-london",
      originCity: "New York",
      destinationCity: "London",
      multiCityRoute: "A classic North Atlantic route where First Class options can vary by airline, aircraft and travel date.",
      price: "$1,899",
      image: unsplash("1513635269975-59663e0ac1ad"),
      alt: "The Elizabeth Tower and Houses of Parliament in London",
      href: "#connect",
      tagline: "First Class · North Atlantic · Premium Travel",
    },
    {
      id: "new-york-paris",
      originCity: "New York",
      destinationCity: "Paris",
      multiCityRoute: "A premium long-haul journey connecting New York with one of Europe's most popular destinations.",
      price: "$1,899",
      image: unsplash("1502602898657-3e91760cbb34"),
      alt: "The Eiffel Tower rising above the rooftops of Paris at dusk",
      href: "#connect",
      tagline: "First Class · Europe · Luxury Leisure",
    },
  ];

  return (
    <>
      <Header />
      <main id="top">
        <MultiCityHero
          headingLines={["First Class Flights,", "Planned Around Your Journey"]}
          paragraphs={[
            "Not every First Class ticket offers the same experience. One traveller may prioritise privacy and sleep, while another may care more about dining, lounge access, aircraft type or flexible fares.",
            "That's why choosing First Class isn't simply about selecting the highest cabin available.",
          ]}
          backgroundImage={unsplash("1474302770737-173ee21bab63")}
          buttonLabel="Speak With a First Class Travel Specialist"
          {...sections.FC_HERO}
        />
        <ExpertGuidanceSection
          heading="Expert Guidance for International First Class Travel"
          paragraphs={[
            "Not every First Class ticket offers the same experience. One traveller may prioritise privacy and sleep, while another may care more about dining, lounge access, aircraft type or flexible fares.",
            "That's why choosing First Class isn't simply about selecting the highest cabin available.",
          ]}
          tags={[]}
          buttonLabel="Compare My First Class Options"
          imageSrc={unsplash("1714079761488-e0c9b9ac4138")}
          {...sections.FC_EXPERT_GUIDANCE}
          imagePosition="left"
        />
        <PlanningFactorsSection
          heading="What Matters Most to You in First Class?"
          subheading="The best First Class experience depends on what you value most. Tell us your priorities, and we'll help you compare suitable options."
          items={[
            { id: "cabin-experience", label: "Cabin Experience", description: "Seat or suite design, privacy and comfort vary significantly between airlines and aircraft." },
            { id: "airline", label: "Airline", description: "Service style, consistency and First Class investment differ from one airline to the next." },
            { id: "privacy", label: "Privacy", description: "Some cabins offer closing doors or high partitions; others are more open." },
            { id: "schedule", label: "Schedule", description: "Overnight routes, connection times and total journey length all affect the experience." },
            { id: "service", label: "Service", description: "Dining style, cabin crew ratios and personalisation vary by airline." },
            { id: "flexibility", label: "Flexibility", description: "Fare rules determine how easily your plans can change after booking." },
          ]}
          {...sections.FC_WHAT_MATTERS}
        />
        <FeaturedBlockSection
          headingLines={flightSearchChallenge?.headingLines ?? ["Why Choosing First Class", "Takes More Than a Flight Search"]}
          body={
            flightSearchChallenge?.body ??
            "Searching for First Class flights can quickly become complicated. Which airline offers the right product for your route? Does your destination have First Class service? Will the same cabin operate on every segment? Is First Class worth the additional cost over Business Class?"
          }
          images={
            flightSearchChallenge?.images ?? [
              { src: unsplash("1569154941061-e231b4725ef1"), alt: "A passenger's premium business class seat and workspace in flight" },
            ]
          }
          benefits={
            flightSearchChallenge?.benefits ?? [
              "Which aircraft operates the flight?",
              "Are flexible or refundable fares available?",
              "Can First Class and Business Class be combined?",
              "What happens if your preferred airline doesn't offer First Class on the route?",
            ]
          }
          buttonLabel={flightSearchChallenge?.buttonLabel ?? "Speak With a First Class Specialist"}
          buttonHref={flightSearchChallenge?.buttonHref ?? "#connect"}
          imagePosition="right"
        />
        <FirstClassOptionsCarousel {...sections.FC_OPTIONS} />
        <FirstClassComparisonSection {...sections.FC_COMPARISON} />
        <FirstClassAirlinesCarousel {...sections.FC_AIRLINES} />
        <FirstClassCabinSection {...sections.FC_CABIN} />
        <HowItWorksCarousel
          heading="How We Plan Your First Class Itinerary"
          subheading="We look beyond the airfare to understand how the entire journey fits together."
          steps={[
            { id: "understand-journey", titleLines: "Understand Your\nJourney", descriptionLines: "Destinations, dates & priorities." },
            { id: "compare-options", titleLines: "Compare Premium\nOptions", descriptionLines: "We evaluate suitable First Class\nand Business Class possibilities." },
            { id: "evaluate-airlines", titleLines: "Evaluate Airlines\n& Routes", descriptionLines: "We compare aircraft, cabins\nand routings." },
            { id: "build-itinerary", titleLines: "Build the Right\nItinerary", descriptionLines: "We present the options.\nYou decide." },
          ]}
          {...sections.FC_HOW_IT_WORKS}
        />
        <FirstClassAircraftSection {...sections.FC_AIRCRAFT} />
        <FeaturedBlockSection
          headingLines={beforeBooking?.headingLines ?? ["Before You Book a", "First Class Flight"]}
          body={
            beforeBooking?.body ??
            "Travelling internationally in First Class can involve different airlines, routes, schedules and fare structures."
          }
          images={
            beforeBooking?.images ?? [
              { src: unsplash("1569629743817-70d8db6c323b"), alt: "A wide-body aircraft on final approach against a blue sky" },
              { src: unsplash("1587019158091-1a103c5dd17f"), alt: "A commercial aircraft on final approach against a blue sky" },
            ]
          }
          twoColumnItems={
            beforeBooking?.twoColumnItems ?? [
              ["Aircraft type", "Cabin layout", "Suite privacy", "Overnight schedule", "Connection duration"],
              ["Lounge access", "Ground services", "Chauffeur service where offered", "Fare change conditions", "Refundability"],
            ]
          }
          buttonLabel={beforeBooking?.buttonLabel ?? "Review My First Class Options"}
          buttonHref={beforeBooking?.buttonHref ?? "#connect"}
          imagePosition="left"
        />
        <FeaturedBlockSection
          headingLines={boardingExperience?.headingLines ?? ["The First Class Experience", "Can Begin Before Boarding"]}
          body={
            boardingExperience?.body ??
            "Depending on the airline and airport, First Class may include premium services before you board. These benefits vary by airline, airport, route and ticket, so we consider them when comparing the complete journey."
          }
          images={
            boardingExperience?.images ?? [
              {
                src: unsplash("1530521954074-e64f6810b32d"),
                alt: "A business traveller relaxing at the gate as an aircraft departs",
              },
            ]
          }
          twoColumnItems={
            boardingExperience?.twoColumnItems ?? [
              ["Airport Arrival", "Premium Check-In", "Security / Fast Track Where Available", "First Class Lounge"],
              ["Dining & Rest", "Priority Boarding", "First Class Onboard Experience", "Arrival Services Where Offered"],
            ]
          }
          imagePosition="right"
        />
        <FirstClassFareSection {...sections.FC_FARE} />
        <RoutesCarousel
          heading="Popular First Class Routes From North America"
          subheading="Looking for inspiration for your next premium journey?"
          cabinLabel="First Class"
          routes={fcRoutes.map((route) => ({ ...route, multiCityRoute: [route.multiCityRoute] }))}
        />
        <PlanningFactorsSection
          heading="Personalised First Class Travel Planning"
          subheading="You don't have to compare every airline, aircraft and fare rule yourself. Our process is built around your journey."
          items={
            sections.FC_PLANNING?.items ?? [
              { id: "arrival-departure", label: "Arrival & Departure Cities", description: "Which city you fly into and out of shapes the entire route." },
              { id: "destinations", label: "Destinations", description: "The cities you want to visit, and the order that makes sense." },
              { id: "travel-time", label: "Travel Time", description: "How much time you have, and how it's best spent in the air versus on the ground." },
              { id: "flight-structure", label: "Flight Structure", description: "Whether a one-way, open-jaw, or round-trip structure fits your trip best." },
              { id: "cabin-preference", label: "Cabin Preference", description: "First Class, Business Class, or a mix — availability varies by route." },
              { id: "fare-flexibility", label: "Fare Flexibility", description: "Whether you need to change dates or routing, and how that affects your fare." },
            ]
          }
        />
        <WhyChooseSection variant="dark" {...sections.FC_WHY_CHOOSE} />
        <FeaturedBlockSection
          headingLines={journeyPreferences?.headingLines ?? ["Tell Us What You Want From", "Your First Class Journey"]}
          body={
            journeyPreferences?.body ??
            "The more we understand about your trip, the more effectively we can compare suitable options."
          }
          images={
            journeyPreferences?.images ?? [
              { src: unsplash("1569154941061-e231b4725ef1"), alt: "A passenger's premium business class seat and workspace in flight" },
            ]
          }
          twoColumnItems={
            journeyPreferences?.twoColumnItems ?? [
              ["Departure airport", "Destination", "Travel dates", "Flexible dates", "One-way, return or multi-city travel", "Preferred airline"],
              ["Preferred cabin or suite style", "Overnight flight preference", "Direct flight preference", "Lounge preferences", "Flexible or refundable fare requirements", "Loyalty programme"],
            ]
          }
          buttonLabel={journeyPreferences?.buttonLabel ?? "Build My Journey"}
          buttonHref={journeyPreferences?.buttonHref ?? "#connect"}
          buttonVariant="gold"
          imagePosition="right"
        />
        <FirstClassCenteredCta {...sections.FC_PLAN_CTA} />
        <LightFaqSection {...sections.FC_FAQ} />
        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} />
      </main>
      <Footer />
    </>
  );
}
