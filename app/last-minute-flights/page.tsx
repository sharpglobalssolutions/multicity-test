import type { Metadata } from "next";
import { FeaturedBlockSection } from "@/components/multi-city/FeaturedBlockSection";
// This page's planning-factors grid and complexity section reuse the
// Multi-City Flights/Flight Cancellation pages' components directly (see
// each one's own doc comment) — both are generic enough (no page-specific
// copy baked into their JSX, only into their default props) that building
// near-identical ones here would just be duplication.
import { PlanningFactorsSection } from "@/components/multi-city/PlanningFactorsSection";
import { ComplexitySection } from "@/components/multi-city/ComplexitySection";
import { MultiCityHero } from "@/components/multi-city/MultiCityHero";
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { unsplash } from "@/lib/images";
import {
  getLastMinuteFlightsPageSeoSafely,
  getLastMinuteFlightsSectionsSafely,
} from "@/services/last-minute-flights.service";
import type { Faq } from "@/data/content";

// Every section below reads its content from the database (see
// services/last-minute-flights.service.ts) — revalidate periodically so
// edits made in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA` section type — `FinalCTA`'s
 * own built-in default is homepage copy, so without this, a missing section
 * here would silently show homepage content instead of this page's copy.
 * Same pattern every other page's `app/*\/page.tsx` uses. */
const DEFAULT_CTA = {
  heading: "Need to Travel Soon?",
  body: "Whether you're booking for today, tomorrow or the next few days, our travel specialists can help you compare available airlines, routes, cabins and fare options quickly — so you can make a confident decision under time pressure.",
  buttonLabel: "Request an Urgent Flight Quote",
  buttonHref: "#connect",
  backgroundImage: unsplash("1500835556837-99ac94a94552"),
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "today-tomorrow",
    question: "Can I book an international flight for today or tomorrow?",
    answer:
      "In many cases, yes — though availability, airlines and fares for same-day or next-day travel can be limited and change quickly.",
  },
  {
    id: "business-class-cost",
    question: "Is last-minute Business Class more expensive?",
    answer: "It can be, though pricing varies by route, airline and remaining availability. We can help you compare what's actually available for your dates.",
  },
  {
    id: "next-few-hours",
    question: "Can you help me find a flight leaving within the next few hours?",
    answer: "We can review what's available, though extremely short notice may limit your options depending on the airline and route.",
  },
  {
    id: "urgent-only",
    question: "Do you only handle urgent travel, or regular bookings too?",
    answer: "We help with both — urgent, last-minute travel as well as flights planned well in advance.",
  },
  {
    id: "one-way-short-notice",
    question: "Can I book a one-way flight on short notice?",
    answer: "Yes — one-way bookings are common for last-minute relocation, family emergencies and open-ended travel.",
  },
  {
    id: "plans-change-again",
    question: "What if my plans might change again after booking?",
    answer: "We can help you review flexible or refundable fares where available, depending on your route and airline.",
  },
  {
    id: "multi-city-urgent",
    question: "Can you help with multi-city travel booked at short notice?",
    answer: "Yes, though multi-city itineraries booked urgently may have fewer available combinations — we'll help you understand what's practical.",
  },
  {
    id: "book-direct",
    question: "Is it better to book directly with an airline for urgent travel?",
    answer: "Not necessarily. A specialist can compare multiple airlines, routes and fare types at once, which can be harder to do quickly on your own.",
  },
  {
    id: "guarantee-availability",
    question: "Can you guarantee a flight will still be available by the time I decide?",
    answer: "No — availability and fares for urgent travel can change quickly, so options should be reviewed based on real-time availability.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getLastMinuteFlightsPageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function LastMinuteFlightsPage() {
  const sections = await getLastMinuteFlightsSectionsSafely();
  const seo = await getLastMinuteFlightsPageSeoSafely();

  const intro = sections.LMF_INTRO;
  const businessClass = sections.LMF_BUSINESS_CLASS;

  return (
    <>
      <JsonLd data={seo?.schemaData} />
      <Header />
      <main id="top">
        <MultiCityHero
          headingLines={["Need to Travel Soon?", "Let's Find the Right Flight."]}
          paragraphs={[
            "When travel can't wait, finding the right international flight can become difficult — especially when you're travelling today, tomorrow or within the next few days.",
            "Whether you need a last-minute Business Class flight, an urgent one-way journey, a family emergency flight or help changing an existing itinerary, our travel specialists help you explore available airlines, routes, cabins and fare options based on your travel needs.",
          ]}
          buttonLabel="Request an Urgent Flight Quote"
          backgroundImage={unsplash("1573497491208-6b1acb260507")}
          {...sections.LMF_HERO}
        />

        <FeaturedBlockSection
          headingLines={intro?.headingLines ?? ["Urgent International Travel", "Assistance When Time Matters"]}
          body={
            intro?.body ??
            "Last-minute travel often comes with limited choices and little time to compare them. Our specialists can help you review available options for:"
          }
          images={
            intro?.images ?? [
              { src: unsplash("1569629743817-70d8db6c323b"), alt: "A wide-body aircraft on final approach against a blue sky" },
            ]
          }
          twoColumnItems={
            intro?.twoColumnItems ?? [
              ["Same-day international departures", "Next-day travel", "Last-minute Business Class", "Economy and Premium Economy", "Urgent one-way flights"],
              ["Return journeys", "Multi-city itineraries", "Alternative airports", "Alternative airlines", "Flexible or refundable fares, where available"],
            ]
          }
          imagePosition="right"
        />

        <PlanningFactorsSection
          heading="When Can We Help With Last-Minute Travel?"
          subheading="Sometimes you need a flight urgently. Other times, your existing travel plans have suddenly changed."
          items={
            sections.LMF_HELP_WITH?.items ?? [
              { id: "emergency-business-travel", label: "Emergency Business Travel", description: "An unexpected client meeting, conference or business requirement can mean you need to travel at short notice. We help you explore available flights around your revised schedule." },
              { id: "family-emergencies", label: "Family Emergencies", description: "Urgent family situations can require international travel with very little notice. Tell us your destination and timing, and we'll help you understand the available travel options." },
              { id: "last-minute-holidays", label: "Last-Minute Holidays", description: "Plans can come together quickly. If you're looking for a short-notice international trip, we can help you compare available routes and fares." },
              { id: "urgent-flight-changes", label: "Urgent Flight Changes", description: "Perhaps you need to leave earlier, postpone your trip or use a different airport. We can help review whether changing your existing booking makes more sense than starting over." },
              { id: "missed-flight-recovery", label: "Missed Flight Recovery", description: "If you've already missed a departure, you may not need to purchase an entirely new ticket immediately. We can help explore rebooking and alternative travel options." },
              { id: "last-minute-business-class", label: "Last-Minute Business Class", description: "Need to travel comfortably on short notice? We can help compare available Business Class options and alternative itineraries." },
            ]
          }
          columns={3}
        />

        <WhyChooseSection
          heading="Your Last-Minute Travel Options"
          features={
            sections.LMF_OPTIONS?.features ?? [
              { id: "business-class", title: "Business Class", description: "Explore available premium-cabin options when comfort, productivity or schedule convenience matters." },
              { id: "economy-class", title: "Economy Class", description: "Review available Economy options for urgent international travel." },
              { id: "one-way-flights", title: "One-Way Flights", description: "Useful for relocation, family emergencies, long stays and other journeys where a return date isn't fixed." },
              { id: "return-flights", title: "Return Flights", description: "Compare available outbound and return options around your travel requirements." },
              { id: "multi-city-itineraries", title: "Multi-City Itineraries", description: "For journeys involving several destinations, we can help explore whether a multi-city structure is practical even when planning at short notice." },
              { id: "flexible-fares", title: "Flexible Fares", description: "Where available, consider fares that provide greater flexibility if your plans may change again." },
              { id: "refundable-fares", title: "Refundable Fares", description: "Review refundable options where offered and where the additional flexibility suits your journey." },
              { id: "alternative-airports", title: "Alternative Airports", description: "A different departure or arrival airport may open up additional possibilities." },
              { id: "alternative-airlines", title: "Alternative Airlines", description: "Comparing multiple carriers may provide different schedules, connections or cabin options." },
            ]
          }
          variant="dark"
          cardStyle="bordered"
          layout="grid"
        />

        <ComplexitySection
          heading="Why Speak With a Travel Specialist When You're Short on Time?"
          subheading="When you're booking urgently, spending hours checking different combinations of flights may not be practical. A travel specialist can help you compare the factors that matter to your journey:"
          items={
            sections.LMF_WHY_SPECIALIST?.items ?? [
              ["Airlines", "Departure airports", "Arrival airports", "Connection times", "Business vs Economy"],
              ["One-way pricing", "Multi-city alternatives", "Flexible ticket options", "Premium cabin availability", "Overall itinerary convenience"],
            ]
          }
          backgroundImage={sections.LMF_WHY_SPECIALIST?.backgroundImage}
        />

        <FeaturedBlockSection
          headingLines={businessClass?.headingLines ?? ["Last-Minute Business Class:", "Explore Your Premium Options"]}
          body={
            businessClass?.body ??
            "Business Class can be worth considering even when you're travelling at short notice. Depending on the route, airline, travel date and remaining availability, premium-cabin fares may offer options that fit an urgent journey better than expected. Our specialists can compare available Business Class itineraries based on:"
          }
          images={
            businessClass?.images ?? [
              { src: unsplash("1569154941061-e231b4725ef1"), alt: "A commercial aircraft parked at the terminal gate before departure" },
            ]
          }
          benefits={
            businessClass?.benefits ?? [
              "Departure and arrival times",
              "Airline",
              "Routing",
              "Aircraft and cabin, where relevant",
              "Connection times",
              "One-way or return travel",
              "Fare conditions",
              "Flexibility",
              "Overall journey convenience",
            ]
          }
          imagePosition="left"
        />

        <PlanningFactorsSection
          heading="Why Travellers Choose MultiCity Experts"
          subheading=""
          items={
            sections.LMF_WHY_CHOOSE?.items ?? [
              { id: "independent-consultants", label: "Independent Travel Consultants", description: "Guidance that isn't tied to a single airline or booking channel." },
              { id: "international-specialists", label: "International Flight Specialists", description: "Deep familiarity with international fare rules and routings." },
              { id: "airline-policy-guidance", label: "Airline Policy Guidance", description: "Help understanding how your specific airline handles urgent bookings and changes." },
              { id: "personalised-support", label: "Personalised Itinerary Support", description: "Recommendations based on your actual travel needs, not a generic policy." },
              { id: "premium-expertise", label: "Premium Travel Expertise", description: "Experience across Economy, Premium Economy, Business and First Class." },
              { id: "one-way-multi-city", label: "One-Way & Multi-City Knowledge", description: "Comfortable with complex routings, not just simple round trips." },
              { id: "post-booking-assistance", label: "Post-Booking Assistance", description: "Support after you've already booked, not just before." },
              { id: "human-advisors", label: "Human Travel Advisors", description: "A specialist you can actually talk to, when time is short." },
            ]
          }
          columns={4}
        />

        <LightFaqSection
          heading={sections.LMF_FAQ?.heading ?? "Frequently Asked Questions"}
          faqs={sections.LMF_FAQ?.faqs ?? DEFAULT_FAQS}
        />

        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} buttonVariant="gold" />
      </main>
      <Footer />
    </>
  );
}
