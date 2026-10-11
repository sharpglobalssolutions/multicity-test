import type { Metadata } from "next";
import { FeaturedBlockSection } from "@/components/multi-city/FeaturedBlockSection";
// This page's hero, step carousels and planning-factors grids reuse the
// Multi-City Flights page's components directly (see each one's own doc
// comment) — both are generic enough (no multi-city-specific copy baked
// into their JSX, only into their default props) that building near-identical
// ones here would just be duplication.
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { MultiCityHero } from "@/components/multi-city/MultiCityHero";
import { PlanningFactorsSection } from "@/components/multi-city/PlanningFactorsSection";
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { InfoBanner } from "@/components/flight-cancellation/InfoBanner";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { unsplash } from "@/lib/images";
import {
  getFlightChangePageSeoSafely,
  getFlightChangeSectionsSafely,
} from "@/services/flight-change.service";
import type { Faq } from "@/data/content";

// Every section below reads its content from the database (see
// services/flight-change.service.ts) — revalidate periodically so edits
// made in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA` section type — `FinalCTA`'s
 * own built-in default is homepage copy, so without this, a missing section
 * here would silently show homepage content instead of this page's copy.
 * Same pattern `app/flight-cancellation/page.tsx`/`app/first-class/page.tsx`
 * use. */
const DEFAULT_CTA = {
  heading: "Need to Change Your Flight?",
  body: "Don't make a change before understanding your options. Whether you need to adjust a travel date, restructure a multi-city itinerary, respond to an airline schedule change or explore a different flight, our specialists can help you review the possibilities.",
  buttonLabel: "Speak With a Travel Specialist",
  buttonHref: "#connect",
  backgroundImage: unsplash("1500835556837-99ac94a94552"),
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "change-international-flight",
    question: "Can I change my international flight?",
    answer:
      "In most cases, yes — though it depends on the fare rules attached to your ticket, the airline, and the route. We help you review what your specific ticket allows.",
  },
  {
    id: "change-cost",
    question: "How much does it cost to change a flight?",
    answer:
      "Costs vary by fare type and airline, and typically include a change fee plus any fare difference between your original and new flight.",
  },
  {
    id: "change-date",
    question: "Can I change my travel date?",
    answer: "Often yes, subject to availability on your preferred new date and the conditions of your fare.",
  },
  {
    id: "change-destination",
    question: "Can I change my destination?",
    answer:
      "Sometimes — this depends on your ticket's routing rules. Changing a destination can involve different conditions than simply changing dates.",
  },
  {
    id: "airline-changed-flight",
    question: "What happens if the airline changes my flight?",
    answer:
      "An airline-initiated schedule change is treated differently from a change you request yourself, and often opens up options like a free rebooking or a refund.",
  },
  {
    id: "change-business-class",
    question: "Can I change a Business Class flight?",
    answer:
      "Yes — though Business Class fares can carry their own change conditions, fare differences and routing considerations depending on the airline.",
  },
  {
    id: "change-first-class",
    question: "Can I change a First Class flight?",
    answer: "Yes, subject to the specific fare rules attached to your First Class ticket, which vary by airline and route.",
  },
  {
    id: "change-multi-city",
    question: "How do I change a multi-city itinerary?",
    answer:
      "We look at the itinerary as a whole, since changing one segment can affect the rest of your route, connections and fares.",
  },
  {
    id: "find-another-flight",
    question: "Can you help me find another flight?",
    answer: "Yes — our specialists can review alternative flights, dates, routings and airlines based on what you need.",
  },
  {
    id: "how-long-change-takes",
    question: "How long does a flight change take?",
    answer:
      "It depends on your airline and the complexity of your request, but we aim to review your options and respond as quickly as possible.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getFlightChangePageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function FlightChangePage() {
  const sections = await getFlightChangeSectionsSafely();
  const seo = await getFlightChangePageSeoSafely();

  const optionsChange = sections.FCH_OPTIONS_CHANGE;
  const process = sections.FCH_PROCESS;
  const expertsHelp = sections.FCH_EXPERTS_HELP;
  const businessClassChanges = sections.FCH_BUSINESS_CLASS_CHANGES;
  const multiCityChange = sections.FCH_MULTICITY_CHANGE;
  const reviewInfo = sections.FCH_REVIEW_INFO;

  return (
    <>
      <JsonLd data={seo?.schemaData} />
      <Header />
      <main id="top">
        <MultiCityHero
          headingLines={["Flight Change", "Assistance for", "International Travel"]}
          subheading="Need to Change Your Flight? We're Here to Help."
          paragraphs={[
            "Travel plans can change without warning. A family emergency, business schedule change, visa delay or airline disruption can leave you unsure about what to do with your flight booking.",
          ]}
          buttonLabel="Speak With a Travel Specialist"
          backgroundImage={unsplash("1573497491208-6b1acb260507")}
          {...sections.FCH_HERO}
        />

        <HowItWorksCarousel
          heading="Expert Guidance When Your Travel Plans Change"
          subheading="Changing an international flight can involve more than selecting a new date."
          paragraph="Depending on your airline, route and ticket conditions, you may need to consider change fees, fare differences, available flights, connection times, airport options and restrictions attached to your fare. We help you understand these details and explore the alternatives available for your journey."
          steps={
            sections.FCH_EXPERT_GUIDANCE?.steps ?? [
              { id: "tell-us-booking", titleLines: "Tell Us About\nYour Booking", descriptionLines: "Route, dates & what changed." },
              { id: "review-conditions", titleLines: "We Review Your\nTicket Conditions", descriptionLines: "Fare rules and change eligibility." },
              { id: "compare-options", titleLines: "We Compare\nthe Options", descriptionLines: "Different flights, dates & routings." },
            ]
          }
          variant="dark"
        />

        <FeaturedBlockSection
          headingLines={optionsChange?.headingLines ?? ["When Your Travel Plans Change,", "Your Options May Change Too"]}
          body={optionsChange?.body ?? "You may be dealing with:"}
          images={
            optionsChange?.images ?? [
              { src: unsplash("1530521954074-e64f6810b32d"), alt: "A business traveller relaxing at the gate as an aircraft departs" },
            ]
          }
          twoColumnItems={
            optionsChange?.twoColumnItems ?? [
              [
                "A change in travel dates",
                "A different departure or arrival time",
                "An airline schedule change",
                "A missed connection",
                "A business meeting being rescheduled",
              ],
              [
                "An unexpected family situation",
                "A change in your destination",
                "One traveller no longer being able to travel",
                "A multi-city itinerary that needs to be adjusted",
                "A need to travel earlier or later than planned",
              ],
            ]
          }
          buttonLabel={optionsChange?.buttonLabel ?? "Explore Flight Change Options"}
          buttonHref={optionsChange?.buttonHref ?? "#connect"}
          imagePosition="left"
        />

        <PlanningFactorsSection
          heading="Before You Change Your Flight, Know Your Options"
          subheading="A flight change isn't always as simple as moving your travel date. Before making a decision, we can help you consider questions such as:"
          items={
            sections.FCH_BEFORE_CHANGE?.items ?? [
              { id: "change-or-cancel", label: "Should You Change or Cancel?", description: "Whether changing fits your situation better than cancelling outright." },
              { id: "real-cost", label: "What Will the Change Really Cost?", description: "Change fees, fare differences and what the new ticket will actually cost." },
              { id: "another-airport", label: "Could Another Airport Work Better?", description: "Whether a nearby airport offers a more suitable option." },
              { id: "partial-journey", label: "Can You Change Only Part of the Journey?", description: "Whether one segment can be adjusted without affecting the rest." },
              { id: "same-day", label: "Is Same-Day Travel Available?", description: "Whether a same-day change is offered on your fare and route." },
              { id: "upgrade", label: "Would an Upgrade Make Sense?", description: "Whether a cabin upgrade is worth considering as part of the change." },
            ]
          }
          columns={3}
        />

        <HowItWorksCarousel
          heading="How We Help With International Flight Changes"
          subheading=""
          steps={
            sections.FCH_HOW_WE_HELP?.steps ?? [
              { id: "airline-policies", titleLines: "Understand Your\nAirline Policies", descriptionLines: "Change rules vary by fare\nand airline." },
              { id: "fare-conditions", titleLines: "Review Your\nFare Conditions", descriptionLines: "What your ticket allows,\nand what it costs." },
              { id: "alternative-flights", titleLines: "Compare Alternative\nFlights", descriptionLines: "Different dates, times\nand routings." },
            ]
          }
        />

        <PlanningFactorsSection
          heading="Common Flight Change Scenarios"
          subheading=""
          items={
            sections.FCH_SCENARIOS?.items ?? [
              { id: "schedule-changes", label: "Schedule Changes", description: "When the airline changes your flight schedule." },
              { id: "date-changes", label: "Date Changes", description: "When your travel dates no longer work." },
              { id: "missed-connections", label: "Missed Connections", description: "When a connection needs to be changed." },
              { id: "alternative-routing", label: "Alternative Routing", description: "When another route may work better." },
              { id: "airline-initiated", label: "Airline-Initiated Changes", description: "When your airline adjusts the schedule for you." },
              { id: "personal-changes", label: "Personal Plan Changes", description: "When your own plans shift unexpectedly." },
              { id: "multi-city-adjustments", label: "Multi-City Adjustments", description: "When one leg of a multi-city trip needs to change." },
              { id: "cabin-changes", label: "Cabin Changes", description: "When you want to change your cabin as part of the update." },
            ]
          }
          columns={4}
        />

        <WhyChooseSection
          heading="Understanding Your Flight Fare Options"
          features={
            sections.FCH_FARE_OPTIONS?.features ?? [
              { id: "flexible-fares", title: "Flexible Fares", description: "Fares that allow date or routing changes, often with fewer restrictions." },
              { id: "semi-flexible-fares", title: "Semi-Flexible Fares", description: "Fares that allow limited changes or date adjustments, typically for a fee." },
              { id: "restricted-fares", title: "Restricted Fares", description: "Fares with tighter change conditions, fees, or limited flexibility." },
              { id: "refundable-fares", title: "Refundable Fares", description: "Fares that may allow a refund instead of or alongside a change." },
            ]
          }
          variant="dark"
        />

        <FeaturedBlockSection
          headingLines={process?.headingLines ?? ["How Our Flight Change", "Assistance Works"]}
          body={process?.body ?? ""}
          images={
            process?.images ?? [
              { src: unsplash("1714079761488-e0c9b9ac4138"), alt: "A friendly travel support specialist wearing a headset" },
            ]
          }
          titledItems={
            process?.titledItems ?? [
              { title: "Tell Us What Has Changed", description: "Share what changed and why you need to review your flight." },
              { title: "We Review Your Booking", description: "Our specialists evaluate your ticket and travel details." },
              { title: "We Explore Your Options", description: "Route, dates & preferences." },
              { title: "Choose the Option That Fits", description: "Our specialists evaluate available alternatives." },
              { title: "Receive Your Updated Travel Details", description: "We present the options. You decide." },
            ]
          }
          imagePosition="right"
        />

        <FeaturedBlockSection
          headingLines={expertsHelp?.headingLines ?? ["When Can MultiCity", "Experts Help?"]}
          body={expertsHelp?.body ?? "Sometimes the change is straightforward. Sometimes the entire journey needs to be reconsidered."}
          images={
            expertsHelp?.images ?? [
              { src: unsplash("1573497491208-6b1acb260507"), alt: "A travel specialist smiling while consulting with a client" },
            ]
          }
          twoColumnItems={
            expertsHelp?.twoColumnItems ?? [
              [
                "Your meeting was rescheduled.",
                "Your holiday dates changed.",
                "You missed a connection.",
                "Your airline changed your schedule.",
                "You need to travel earlier.",
                "You need to postpone your trip.",
              ],
              [
                "One traveller can no longer travel.",
                "Your destination has changed.",
                "Your multi-city itinerary no longer works.",
                "You need to understand whether changing or cancelling makes more sense.",
              ],
            ]
          }
          imagePosition="right"
          background="gray"
        />

        <InfoBanner
          tone="cta"
          heading={sections.FCH_NOT_SURE_BANNER?.heading ?? "Not sure where to start? Tell us what happened, and we'll help you understand your options."}
          body={sections.FCH_NOT_SURE_BANNER?.body ?? ""}
          buttonLabel={sections.FCH_NOT_SURE_BANNER?.buttonLabel ?? "Speak With Travel Specialist"}
          buttonHref={sections.FCH_NOT_SURE_BANNER?.buttonHref ?? "#connect"}
        />

        <FeaturedBlockSection
          headingLines={businessClassChanges?.headingLines ?? ["Business Class", "Flight Changes"]}
          body={
            businessClassChanges?.body ??
            "Changing a Business Class booking can involve additional fare conditions and routing considerations."
          }
          images={
            businessClassChanges?.images ?? [
              { src: unsplash("1569154941061-e231b4725ef1"), alt: "A commercial aircraft parked at the terminal gate before departure" },
            ]
          }
          twoColumnItems={
            businessClassChanges?.twoColumnItems ?? [
              ["Aircraft type", "Cabin layout", "Suite privacy", "Overnight schedule", "Connection duration"],
              ["Lounge access", "Ground services", "Chauffeur service where offered", "Fare change conditions", "Refundability"],
            ]
          }
          imagePosition="left"
        />

        <FeaturedBlockSection
          headingLines={multiCityChange?.headingLines ?? ["Changing a Multi-City", "International Itinerary"]}
          body={
            multiCityChange?.body ??
            "Multi-city bookings require extra care because changing one sector can affect the rest of the journey. Rather than treating each flight separately, we look at the itinerary as a whole and help you understand the potential impact of a change."
          }
          images={
            multiCityChange?.images ?? [
              { src: unsplash("1502602898657-3e91760cbb34"), alt: "The Eiffel Tower rising above the rooftops of Paris at dusk" },
            ]
          }
          twoColumnItems={
            multiCityChange?.twoColumnItems ?? [
              ["Which segment needs to change", "Connection and layover times", "Remaining segments' fares", "Visa or transit requirements"],
              ["Whether other passengers are affected", "Multi-airline coordination", "Overall itinerary impact", "Rebooking the full route if needed"],
            ]
          }
          imagePosition="right"
        />

        <PlanningFactorsSection
          heading="Why Travelers Choose MultiCity Experts"
          subheading=""
          items={
            sections.FCH_WHY_CHOOSE?.items ?? [
              { id: "independent-consultants", label: "Independent Travel Consultants", description: "Guidance that isn't tied to a single airline or booking channel." },
              { id: "international-specialists", label: "International Flight Specialists", description: "Deep familiarity with international fare rules and routings." },
              { id: "airline-policy-guidance", label: "Airline Policy Guidance", description: "Help understanding how your specific airline handles changes." },
              { id: "personalised-support", label: "Personalised Itinerary Support", description: "Recommendations based on your actual booking, not a generic policy." },
              { id: "premium-expertise", label: "Premium Travel Expertise", description: "Experience across Economy, Premium Economy, Business and First Class." },
              { id: "one-way-multi-city", label: "One-Way & Multi-City Knowledge", description: "Comfortable with complex routings, not just simple round trips." },
              { id: "post-booking-assistance", label: "Post-Booking Assistance", description: "Support after you've already booked, not just before." },
              { id: "human-advisors", label: "Human Travel Advisors", description: "A specialist you can actually talk to, when it matters most." },
            ]
          }
          columns={4}
        />

        <FinalCTA
          heading="Flight Changes Aren't One-Size-Fits-All"
          body="The best option depends on what changed and what your ticket allows. A business traveller may need to move a flight by one day. A family may need to change one passenger. A student may need to postpone an international journey. A multi-city traveller may need to restructure several sectors. That's why we start by understanding your situation before discussing possible alternatives."
          buttonLabel="Speak With a Flight Specialist"
          buttonHref="#connect"
          backgroundImage={unsplash("1436491865332-7a61a109cc05")}
          buttonVariant="gold"
          {...sections.FCH_CINEMATIC_CTA}
        />

        <FeaturedBlockSection
          headingLines={reviewInfo?.headingLines ?? ["What Information Do We Need", "to Review Your Flight?"]}
          body={
            reviewInfo?.body ??
            "To help us understand your booking, please provide the details below. If you're unsure about the exact change you need, that's okay — tell us what has happened and we'll start from there."
          }
          images={
            reviewInfo?.images ?? [
              { src: unsplash("1714079761488-e0c9b9ac4138"), alt: "A friendly travel support specialist wearing a headset" },
            ]
          }
          twoColumnItems={
            reviewInfo?.twoColumnItems ?? [
              ["Airline name", "Booking reference, if available", "Departure city and airport", "Destination", "Original travel date"],
              ["Number of passengers", "Cabin class", "What you would like to change", "Preferred new date or time, if known", "Any other travel requirements"],
            ]
          }
          imagePosition="left"
        />

        <LightFaqSection
          heading={sections.FCH_FAQ?.heading ?? "Flight Change FAQs"}
          faqs={sections.FCH_FAQ?.faqs ?? DEFAULT_FAQS}
        />

        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} buttonVariant="gold" />
      </main>
      <Footer />
    </>
  );
}
