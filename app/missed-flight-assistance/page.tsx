import type { Metadata } from "next";
import { FeaturedBlockSection } from "@/components/multi-city/FeaturedBlockSection";
// This page's process carousel, planning-factors grids and complexity
// sections reuse the Multi-City Flights/Flight Cancellation pages'
// components directly (see each one's own doc comment) — all are generic
// enough (no page-specific copy baked into their JSX, only into their
// default props) that building near-identical ones here would just be
// duplication.
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { PlanningFactorsSection } from "@/components/multi-city/PlanningFactorsSection";
import { ComplexitySection } from "@/components/multi-city/ComplexitySection";
import { MultiCityHero } from "@/components/multi-city/MultiCityHero";
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { CenteredCtaBanner } from "@/components/flight-cancellation/CenteredCtaBanner";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { unsplash } from "@/lib/images";
import {
  getMissedFlightAssistancePageSeoSafely,
  getMissedFlightAssistanceSectionsSafely,
} from "@/services/missed-flight-assistance.service";
import type { Faq } from "@/data/content";

// Every section below reads its content from the database (see
// services/missed-flight-assistance.service.ts) — revalidate periodically
// so edits made in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA` section type — `FinalCTA`'s
 * own built-in default is homepage copy, so without this, a missing section
 * here would silently show homepage content instead of this page's copy.
 * Same pattern every other page's `app/*\/page.tsx` uses. */
const DEFAULT_CTA = {
  heading: "Missed Your Flight? Let's Find the Next Step.",
  body: "Your journey may still have options. Before buying another ticket or abandoning your itinerary, let our travel specialists help you understand what may be available and explore the most practical way forward.",
  buttonLabel: "Review My Travel Options",
  buttonHref: "#connect",
  backgroundImage: unsplash("1436491865332-7a61a109cc05"),
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "what-to-do",
    question: "What should I do if I miss my flight?",
    answer:
      "Contact the airline or your travel provider as soon as possible and check the status of your booking. Before purchasing another ticket, review whether your existing booking has any rebooking or other applicable options.",
  },
  {
    id: "find-another-flight",
    question: "Can you help me find another flight after I've missed mine?",
    answer:
      "We can help you explore available flight and itinerary options. Availability and applicable conditions depend on the airline, route and ticket.",
  },
  {
    id: "can-i-rebook",
    question: "Can I rebook a missed flight?",
    answer: "Possibly. Rebooking depends on your fare conditions, airline policy, ticket status and available flights.",
  },
  {
    id: "refund",
    question: "Can I get a refund if I miss my flight?",
    answer: "A refund isn't guaranteed. Whether any refund, credit or other option is available depends on the airline and fare conditions.",
  },
  {
    id: "same-day",
    question: "Can I travel later on the same day?",
    answer: "Sometimes. Same-day alternatives depend on available flights, airline policies and your ticket conditions.",
  },
  {
    id: "flat-tire-policy",
    question: "What is an airline's \"flat tire\" policy?",
    answer:
      "Some airlines may have policies or procedures that can apply in certain situations where a passenger misses a flight due to circumstances beyond their control. These policies vary by airline and are not universally available.",
  },
  {
    id: "another-airport",
    question: "Can I change to another airport?",
    answer:
      "It may be possible to explore another departure airport, but this depends on the airline, routing, fare conditions and available flights.",
  },
  {
    id: "missed-business-class",
    question: "What if I missed a Business Class flight?",
    answer: "Your Business Class fare may have specific rebooking or change conditions. We can help you review available alternatives and understand potential fare differences.",
  },
  {
    id: "missed-multi-city",
    question: "What if I missed one flight on a multi-city booking?",
    answer: "The impact can depend on how your ticket was issued and the remaining sectors. It's important to review the complete itinerary before making another booking.",
  },
  {
    id: "travel-insurance",
    question: "Can travel insurance help after a missed flight?",
    answer: "Potentially, depending on the reason for the missed flight and the terms of your policy. Check the specific coverage, exclusions and claim requirements.",
  },
  {
    id: "guarantee",
    question: "Can you guarantee that I will get another flight?",
    answer: "No. Rebooking and alternative flights depend on airline policies, ticket conditions, availability and other circumstances.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getMissedFlightAssistancePageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function MissedFlightAssistancePage() {
  const sections = await getMissedFlightAssistanceSectionsSafely();

  const intro = sections.MF_INTRO;
  const businessClass = sections.MF_BUSINESS_CLASS;
  const multiCity = sections.MF_MULTI_CITY;
  const infoReady = sections.MF_INFO_READY;

  return (
    <>
      <Header />
      <main id="top">
        <MultiCityHero
          headingLines={["Missed Your Flight?", "Let's Help You Get Back on Track."]}
          paragraphs={[
            "Missing a flight can be stressful, especially when you're already at the airport or travelling on a tight schedule. But missing your departure doesn't always mean your journey is over.",
            "Depending on your airline, ticket conditions and circumstances, there may be several ways to continue your trip. Our travel specialists help you review your booking, understand the available airline options and explore practical next steps for your journey.",
          ]}
          buttonLabel="Review My Travel Options"
          backgroundImage={unsplash("1573497491208-6b1acb260507")}
          {...sections.MF_HERO}
        />

        <FeaturedBlockSection
          headingLines={intro?.headingLines ?? ["Emergency Travel Assistance", "After a Missed Flight"]}
          body={
            intro?.body ??
            "When you've missed a departure, the priority is understanding what can still be done with your existing booking. We can help you review:"
          }
          images={
            intro?.images ?? [
              { src: unsplash("1714079761488-e0c9b9ac4138"), alt: "A friendly travel support specialist wearing a headset" },
            ]
          }
          benefits={
            intro?.benefits ?? [
              "Your ticket and fare conditions",
              "Available rebooking options",
              "Same-day flight alternatives",
              "Alternative departure airports",
              "One-way travel options",
              "Potential fare differences",
              "Travel credits or other applicable options",
              "The impact on onward or return flights",
            ]
          }
          imagePosition="right"
        />

        <PlanningFactorsSection
          heading="What Can We Help With After You Miss a Flight?"
          subheading=""
          items={
            sections.MF_HELP_WITH?.items ?? [
              { id: "missed-departure", label: "Missed Departure", description: "If you've missed your scheduled flight, we can help you understand what options may remain under your ticket conditions." },
              { id: "late-arrival", label: "Late Arrival at the Airport", description: "Traffic, parking delays or unexpected problems getting to the airport can leave little time before departure." },
              { id: "security-delays", label: "Security or Immigration Delays", description: "Long queues can sometimes affect your ability to reach the gate in time." },
              { id: "same-day-alternatives", label: "Same-Day Alternatives", description: "Where available, we can help explore later flights on the same day." },
              { id: "rebooking-guidance", label: "Rebooking Guidance", description: "Understand whether your existing ticket may allow rebooking or whether another travel arrangement needs to be considered." },
              { id: "fare-review", label: "Fare Review", description: "Before paying for a completely new ticket, it can be useful to understand the conditions and potential costs associated with your original booking." },
              { id: "alternative-airports", label: "Alternative Airports", description: "Depending on your destination and urgency, another nearby airport may provide an additional option." },
            ]
          }
          columns={4}
        />

        <PlanningFactorsSection
          heading="Before You Book Another Flight, Check Your Options"
          subheading="When you've missed a flight, buying a completely new ticket may feel like the fastest solution. But before spending more money, consider checking:"
          items={
            sections.MF_BEFORE_BOOK?.items ?? [
              { id: "missed-flight-policy", label: "Does Your Airline Have a Missed-Flight Policy?", description: "Some airlines may have specific policies or procedures for passengers who miss a flight. Conditions vary, so the applicable airline and fare rules should be checked." },
              { id: "same-day-possible", label: "Is Same-Day Travel Possible?", description: "A later departure may be available, depending on the route, airline and remaining inventory." },
              { id: "ticket-valid", label: "Is Your Ticket Still Valid?", description: "The status of your booking and remaining itinerary can affect what options are available." },
              { id: "protected-itinerary", label: "Was Your Journey on a Protected Itinerary?", description: "If your flights were booked as part of one ticket, your options may differ from those on separate tickets." },
              { id: "travel-insurance", label: "Does Travel Insurance Apply?", description: "Depending on the circumstances and policy terms, travel insurance may provide relevant benefits. Always check the actual coverage and exclusions." },
              { id: "card-benefits", label: "Do You Have Card Travel Benefits?", description: "Some credit cards may include travel-related benefits, subject to their individual terms and eligibility requirements." },
            ]
          }
          columns={3}
        />

        <ComplexitySection
          heading="Why Do Travellers Miss Flights?"
          subheading="Missing a flight can happen for many reasons, including:"
          items={
            sections.MF_WHY_MISS?.items ?? [
              ["Heavy traffic", "Long security queues", "Immigration delays", "Airport congestion", "Weather disruption"],
              ["A delayed previous flight", "Gate or terminal confusion", "Unexpected medical situations", "Long airport transfers", "Unfamiliar airports"],
            ]
          }
          backgroundImage={sections.MF_WHY_MISS?.backgroundImage}
        />

        <WhyChooseSection
          heading="What Are Your Options After Missing a Flight?"
          features={
            sections.MF_OPTIONS?.features ?? [
              { id: "rebooking", title: "Rebooking", description: "Your existing ticket may allow a new flight subject to applicable fare rules and availability." },
              { id: "same-day-changes", title: "Same-Day Changes", description: "A later flight on the same day may be an option where offered and available." },
              { id: "alternative-routing", title: "Alternative Routing", description: "A different route may help you reach your destination sooner or more practically." },
              { id: "nearby-airports", title: "Nearby Airports", description: "An alternative departure airport may provide additional flight choices." },
              { id: "refund-credit-review", title: "Refund or Travel Credit Review", description: "Depending on your ticket conditions, there may be refund or credit considerations." },
              { id: "new-itinerary", title: "New Itinerary Planning", description: "If the original booking can no longer be used, you may need to consider a completely new travel arrangement." },
            ]
          }
          variant="dark"
          cardStyle="bordered"
          layout="grid"
        />

        <FeaturedBlockSection
          headingLines={businessClass?.headingLines ?? ["What If You Missed a", "Business Class Flight?"]}
          body={
            businessClass?.body ??
            "Missing a Business Class flight can be particularly frustrating, especially when the replacement options involve significant fare differences. A premium ticket doesn't automatically mean it can be changed without conditions. We can help you review:"
          }
          images={
            businessClass?.images ?? [
              { src: unsplash("1587019158091-1a103c5dd17f"), alt: "A commercial aircraft on final approach against a blue sky" },
            ]
          }
          benefits={
            businessClass?.benefits ?? [
              "Business Class fare conditions",
              "Rebooking possibilities",
              "Alternative Business Class flights",
              "Same-day options where available",
              "Different routing",
              "One-way alternatives",
              "Fare differences",
              "The impact on remaining sectors",
            ]
          }
          imagePosition="left"
        />

        <FeaturedBlockSection
          headingLines={multiCity?.headingLines ?? ["Missed a Flight on a", "Multi-City Itinerary?"]}
          body={
            multiCity?.body ??
            "A missed departure can affect more than one flight when you're travelling on a multi-city itinerary. For example, missing the first sector could affect:"
          }
          images={
            multiCity?.images ?? [
              { src: unsplash("1502602898657-3e91760cbb34"), alt: "The Eiffel Tower rising above the rooftops of Paris at dusk" },
            ]
          }
          benefits={
            multiCity?.benefits ?? [
              "Subsequent destinations",
              "Connecting flights",
              "Remaining sectors",
              "Return travel",
              "Ticket validity",
              "Overall itinerary conditions",
            ]
          }
          imagePosition="right"
        />

        <HowItWorksCarousel
          heading="How We Help You Recover Your Journey"
          subheading="A clear process from the moment you tell us what happened."
          steps={
            sections.MF_HOW_WE_HELP?.steps ?? [
              { id: "tell-us-happened", titleLines: "Tell Us What\nHappened", descriptionLines: "Share your airline, booking details,\ndestination and circumstances." },
              { id: "review-booking", titleLines: "We Review Your\nBooking", descriptionLines: "Our specialists look at the itinerary,\nticket structure and fare conditions." },
              { id: "explore-options", titleLines: "We Explore Available\nOptions", descriptionLines: "Rebooking, alternative flights,\nroutes and other possibilities." },
              { id: "review-choices", titleLines: "You Review the\nChoices", descriptionLines: "We explain the options so you can\ndecide what works best." },
              { id: "move-forward", titleLines: "Move Forward With\nYour Journey", descriptionLines: "We assist with the next steps\nwhere applicable." },
            ]
          }
        />

        <ComplexitySection
          heading="When Can MultiCity Experts Help?"
          subheading=""
          listIntro="You may need urgent travel assistance because:"
          items={
            sections.MF_URGENT_HELP?.items ?? [
              [
                "You arrived at the airport too late.",
                "Traffic delayed you.",
                "Security took longer than expected.",
                "You missed your boarding window.",
                "Your previous flight was delayed.",
              ],
              [
                "You need to reach your destination today.",
                "Your original flight is no longer usable.",
                "You need to find another departure airport.",
                "You're travelling Business Class.",
                "Your missed flight is part of a multi-city itinerary.",
              ],
            ]
          }
          backgroundImage={sections.MF_URGENT_HELP?.backgroundImage ?? ""}
          align="center"
        />

        <PlanningFactorsSection
          heading="Why Travellers Choose MultiCity Experts"
          subheading=""
          items={
            sections.MF_WHY_CHOOSE?.items ?? [
              { id: "emergency-support", label: "Emergency Travel Support", description: "Guidance when an unexpected disruption leaves you unsure what to do next." },
              { id: "airline-policy-guidance", label: "Airline Policy Guidance", description: "Help understanding the conditions that apply to your booking." },
              { id: "international-specialists", label: "International Travel Specialists", description: "Experience with complex international journeys and North Atlantic routes." },
              { id: "one-way-expertise", label: "One-Way Expertise", description: "Support when a missed flight means your original return structure no longer works." },
              { id: "multi-city-knowledge", label: "Multi-City Knowledge", description: "Understanding how one missed sector can affect the rest of a complex itinerary." },
              { id: "business-class-specialists", label: "Business Class Specialists", description: "Premium travel expertise for travellers dealing with disrupted Business Class journeys." },
              { id: "human-advisors", label: "Human Travel Advisors", description: "Speak directly with a travel specialist about your situation." },
              { id: "post-booking-support", label: "Post-Booking Support", description: "Assistance focused on helping you navigate changes after your original booking." },
            ]
          }
          columns={4}
        />

        <FeaturedBlockSection
          headingLines={infoReady?.headingLines ?? ["What Information Should", "You Have Ready?"]}
          body={infoReady?.body ?? "To help us review your situation, provide:"}
          images={
            infoReady?.images ?? [
              { src: unsplash("1530521954074-e64f6810b32d"), alt: "A business traveller relaxing at the gate as an aircraft departs" },
            ]
          }
          twoColumnItems={
            infoReady?.twoColumnItems ?? [
              ["Airline", "Booking reference", "Original departure airport", "Destination", "Scheduled departure time", "Current location"],
              ["Reason for missing the flight", "Number of travellers", "Cabin class", "Whether you have checked baggage", "How urgently you need to travel", "Preferred travel dates or times, if flexible"],
            ]
          }
          imagePosition="left"
        />

        <CenteredCtaBanner
          heading={sections.MF_REVIEW_CTA?.heading ?? "Review Your Travel Options"}
          subheading={
            sections.MF_REVIEW_CTA?.subheading ??
            "Missed your departure? Don't make a rushed decision. Tell us what happened, where you're trying to go and how urgently you need to travel — our specialists can help you understand the available options and explore a practical way forward."
          }
          buttonLabel={sections.MF_REVIEW_CTA?.buttonLabel ?? "Review My Options"}
          buttonHref={sections.MF_REVIEW_CTA?.buttonHref ?? "#connect"}
        />

        <LightFaqSection
          heading={sections.MF_FAQ?.heading ?? "Frequently Asked Questions"}
          faqs={sections.MF_FAQ?.faqs ?? DEFAULT_FAQS}
        />

        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} buttonVariant="gold" />
      </main>
      <Footer />
    </>
  );
}
