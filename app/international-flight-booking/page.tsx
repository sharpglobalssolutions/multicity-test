import type { Metadata } from "next";
import { FeaturedBlockSection } from "@/components/multi-city/FeaturedBlockSection";
// This page's hero, step carousels, planning-factors grids and cinematic
// section reuse the Multi-City Flights/Flight Cancellation pages'
// components directly (see each one's own doc comment) — all are generic
// enough (no page-specific copy baked into their JSX, only into their
// default props) that building near-identical ones here would just be
// duplication.
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { MultiCityHero } from "@/components/multi-city/MultiCityHero";
import { PlanningFactorsSection } from "@/components/multi-city/PlanningFactorsSection";
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { WorkAroundYouSection } from "@/components/multi-city/WorkAroundYouSection";
import { ScheduleChangeSection } from "@/components/flight-cancellation/ScheduleChangeSection";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { unsplash } from "@/lib/images";
import {
  getInternationalFlightBookingPageSeoSafely,
  getInternationalFlightBookingSectionsSafely,
} from "@/services/international-flight-booking.service";
import type { Faq, ServiceCard } from "@/data/content";

// Every section below reads its content from the database (see
// services/international-flight-booking.service.ts) — revalidate
// periodically so edits made in the admin panel appear without a full
// redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA` section type — `FinalCTA`'s
 * own built-in default is homepage copy, so without this, a missing section
 * here would silently show homepage content instead of this page's copy.
 * Same pattern `app/flight-change/page.tsx`/`app/flight-cancellation/page.tsx`
 * use. */
const DEFAULT_CTA = {
  heading: "Plan Your International Journey With Expert Guidance",
  body: "You don't need to know the perfect airline, route or fare before you reach out. Tell us where you're going, when you plan to travel and what matters most to you. We'll help you explore the available international flight options and understand the differences before you book.",
  buttonLabel: "Speak With a Travel Specialist",
  buttonHref: "#connect",
  backgroundImage: unsplash("1436491865332-7a61a109cc05"),
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "get-help-booking",
    question: "How can I get help booking an international flight?",
    answer:
      "Tell us your destinations, travel dates and preferences, and a travel specialist will help you compare suitable international flight options before you book.",
  },
  {
    id: "compare-options",
    question: "Can you help compare international flight options?",
    answer: "Yes — we compare airlines, routes, schedules, aircraft and fare conditions to help you find a suitable option.",
  },
  {
    id: "complex-routes",
    question: "Can you help with complex international routes?",
    answer: "Yes — connections, multiple airlines and less conventional routings are something our specialists regularly help plan.",
  },
  {
    id: "multi-city-planning",
    question: "Can you help plan multi-city international travel?",
    answer: "Yes — multi-city and open-jaw itineraries across several destinations are one of our specialties.",
  },
  {
    id: "business-class",
    question: "Can you help find Business Class flights?",
    answer: "Yes — we help compare Business Class options across airlines, routes and fare types.",
  },
  {
    id: "first-class",
    question: "Can you help find First Class flights?",
    answer: "Yes — First Class availability is more limited than Business Class, and we help identify suitable options based on your journey.",
  },
  {
    id: "information-needed",
    question: "What information do you need to search for a flight?",
    answer:
      "Your departure city, destination, travel dates, number of passengers, cabin preference and any flexibility help us begin reviewing suitable options.",
  },
  {
    id: "flexible-dates",
    question: "Can I request flexible travel dates?",
    answer: "Yes — let us know your flexibility and we'll factor that into the options we review with you.",
  },
  {
    id: "compare-airlines",
    question: "Can you help compare different airlines?",
    answer: "Yes — different airlines can offer very different schedules, connections, cabin products and fare conditions.",
  },
  {
    id: "flight-changes",
    question: "Can you help with flight changes after booking?",
    answer: "Yes — our specialists can help you review rebooking, refund and flight-change options if your plans shift after booking.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getInternationalFlightBookingPageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function InternationalFlightBookingPage() {
  const sections = await getInternationalFlightBookingSectionsSafely();

  const fareGuidance = sections.IFB_FARE_GUIDANCE;
  const whoWeHelp = sections.IFB_WHO_WE_HELP;
  const reviewInfo = sections.IFB_REVIEW_INFO;

  const journeyTypes: ServiceCard[] = sections.IFB_JOURNEY_TYPES?.services ?? [
    {
      id: "business-travel",
      category: "Business Travel",
      title: "Business Class Flights",
      description: "Comfortable long-haul travel with premium service and better space.",
      image: unsplash("1569629743817-70d8db6c323b"),
      alt: "A wide-body aircraft on final approach against a blue sky",
      href: "#connect",
    },
    {
      id: "family-travel",
      category: "Family Travel",
      title: "First Class Flights",
      description: "Privacy, space and an elevated experience from the airport to your destination.",
      image: unsplash("1587019158091-1a103c5dd17f"),
      alt: "A commercial aircraft on final approach against a blue sky",
      href: "#connect",
    },
    {
      id: "multi-city-travel",
      category: "Multi-City Travel",
      title: "Multi-City Flights",
      description: "Multiple destinations & complicated routes made easier with expert planning.",
      image: unsplash("1500835556837-99ac94a94552"),
      alt: "View from an aircraft window over clouds lit by a golden sunset",
      href: "#connect",
    },
    {
      id: "long-haul-travel",
      category: "Long-Haul Travel",
      title: "One-Way International Flights",
      description: "Multiple destinations & complicated routes made easier with expert planning.",
      image: unsplash("1474302770737-173ee21bab63"),
      alt: "A private jet on the tarmac at golden hour",
      href: "#connect",
    },
  ];

  return (
    <>
      <Header />
      <main id="top">
        <MultiCityHero
          headingLines={["International Flight Booking", "Assistance,", "Planned Around Your Journey"]}
          paragraphs={[
            "Whether you're planning Business Class travel, a one-way journey, a multi-city itinerary or a family trip across the Atlantic, our travel specialists help you compare airlines, routes and fare options before you book.",
            "Get personalised guidance based on your destinations, travel dates, cabin preference and priorities.",
          ]}
          buttonLabel="Speak With a Travel Specialist"
          backgroundImage={unsplash("1573497491208-6b1acb260507")}
          {...sections.IFB_HERO}
        />

        <PlanningFactorsSection
          heading="Expert Guidance for International Flight Bookings"
          subheading="Every international journey has different priorities. Our specialists help you explore your options and understand the details that can make a difference before you confirm your booking."
          items={
            sections.IFB_EXPERT_GUIDANCE?.items ?? [
              { id: "international-specialists", label: "International Flight Specialists", description: "Deep familiarity with international routes, airlines and fare rules." },
              { id: "business-class-expertise", label: "Business Class Expertise", description: "Experience comparing premium cabin options across airlines." },
              { id: "multi-city-planning", label: "Multi-City Planning", description: "Comfortable coordinating multiple destinations into one itinerary." },
              { id: "one-way-travel", label: "One-Way Travel", description: "Support for one-way bookings, not just standard round trips." },
            ]
          }
          columns={4}
        />

        <WhyChooseSection
          heading="Finding the Right Flight Isn't Just About Price"
          features={
            sections.IFB_FLIGHT_PRICE?.features ?? [
              { id: "airlines", title: "Airlines", description: "Compare different carriers and their available routes." },
              { id: "aircraft", title: "Aircraft", description: "Consider cabin products and comfort across different aircraft types." },
              { id: "departure-airports", title: "Departure Airports", description: "Explore alternative airports when they make sense for your journey." },
              { id: "arrival-airports", title: "Arrival Airports", description: "Consider whether another arrival city could work better." },
              { id: "fare-flexibility", title: "Fare Flexibility", description: "Compare different fare conditions and how much flexibility they allow." },
            ]
          }
          variant="dark"
        />

        <ServicesCarousel
          heading="What Kind of International Journey Are You Planning?"
          subheading="Tell us what kind of trip you're planning, and we'll help you explore suitable flight options."
          services={journeyTypes}
          linkLabel="Learn More"
        />

        <ScheduleChangeSection
          headingLines={["Popular North Atlantic", "Routes"]}
          body="Our focus includes international travel between North America, the UK and Europe."
          rightHeading="Popular route examples include:"
          rightColumnA={"New York ↔ London\nChicago ↔ Frankfurt\nToronto ↔ Paris"}
          rightColumnB={"Boston ↔ Zurich\nMiami ↔ Madrid\nLos Angeles ↔ London"}
          rightNote="Flight schedules, airlines, aircraft and fares vary by travel date. These routes are examples of journeys our specialists can help you explore."
          flowSteps={[]}
          {...sections.IFB_ROUTES}
        />

        <PlanningFactorsSection
          heading="Compare Airlines Before You Book"
          subheading="Different airlines can offer very different schedules, connections, cabin products and fare conditions even when travelling between similar destinations. Depending on your route and dates, you may want to compare airlines such as:"
          items={
            sections.IFB_AIRLINES?.items ?? [
              { id: "british-airways", label: "British Airways", description: "A major carrier connecting the UK with North America and beyond." },
              { id: "american-airlines", label: "American Airlines", description: "Extensive North American routes with international connections." },
              { id: "united-airlines", label: "United Airlines", description: "A wide international network across multiple hub airports." },
              { id: "lufthansa", label: "Lufthansa", description: "A major European carrier with extensive transatlantic routes." },
              { id: "air-france", label: "Air France", description: "Connections across Europe with international long-haul options." },
              { id: "delta-air-lines", label: "Delta Air Lines", description: "A major US carrier with broad international coverage." },
            ]
          }
          columns={3}
        />

        <FeaturedBlockSection
          headingLines={fareGuidance?.headingLines ?? ["Flexible Fare Guidance for", "International Travel"]}
          body={
            fareGuidance?.body ??
            "Not every traveller needs the same type of ticket. A leisure traveller may prioritise price. A business traveller may need flexibility. A family may value the ability to change dates, while someone planning a long international stay may prefer a one-way fare. Depending on your journey, we can help you understand and compare:"
          }
          images={
            fareGuidance?.images ?? [
              { src: unsplash("1530521954074-e64f6810b32d"), alt: "A business traveller relaxing at the gate as an aircraft departs" },
            ]
          }
          twoColumnItems={
            fareGuidance?.twoColumnItems ?? [
              ["Flexible fares", "Refundable fares", "Restricted fares", "Changeable tickets", "One-way fares"],
              ["Round-trip fares", "Multi-city fares", "Premium cabin fares", "Fare differences and conditions"],
            ]
          }
          buttonLabel={fareGuidance?.buttonLabel ?? "Talk to a Travel Specialist"}
          buttonHref={fareGuidance?.buttonHref ?? "#connect"}
          imagePosition="right"
          background="gray"
        />

        <PlanningFactorsSection
          heading="Before You Confirm Your International Flight"
          subheading="A flight can look attractive on price alone and still be the wrong fit for your journey."
          items={
            sections.IFB_BEFORE_CONFIRM?.items ?? [
              { id: "arrival-departure-cities", label: "Arrival & Departure Cities", description: "Which cities you fly into and out of shapes the entire journey." },
              { id: "destinations", label: "Destinations", description: "Whether every stop on your itinerary is served the way you expect." },
              { id: "travel-time", label: "Travel Time", description: "How much time you have, and how it's best spent in the air versus on the ground." },
              { id: "flight-structure", label: "Flight Structure", description: "Whether a one-way, round-trip or multi-city structure fits your trip best." },
              { id: "cabin-preference", label: "Cabin Preference", description: "Economy, Premium Economy, Business or First Class — availability varies by route." },
              { id: "fare-flexibility", label: "Fare Flexibility", description: "Whether you may need to change dates or routing after booking." },
            ]
          }
          columns={3}
        />

        <HowItWorksCarousel
          heading="A More Personal Way to Book International Flights"
          subheading="Instead of simply searching and selecting a result, our process starts with understanding your journey."
          steps={
            sections.IFB_PERSONAL_PROCESS?.steps ?? [
              { id: "tell-us-journey", titleLines: "Tell Us Your\nJourney", descriptionLines: "Route, dates & preferences." },
              { id: "we-explore-itineraries", titleLines: "We Explore Possible\nItineraries", descriptionLines: "Our specialists evaluate available\nBusiness Class possibilities." },
              { id: "compare-routes-options", titleLines: "Compare Routes\n& Flight Options", descriptionLines: "We present the options.\nYou decide." },
            ]
          }
          variant="gray"
        />

        <FeaturedBlockSection
          headingLines={whoWeHelp?.headingLines ?? ["Who We Help With", "International Travel"]}
          body={whoWeHelp?.body ?? "Our international flight booking assistance can be useful for:"}
          images={
            whoWeHelp?.images ?? [
              { src: unsplash("1714079761488-e0c9b9ac4138"), alt: "A friendly travel support specialist wearing a headset" },
            ]
          }
          twoColumnItems={
            whoWeHelp?.twoColumnItems ?? [
              [
                "Business travellers",
                "Executive travellers",
                "Premium leisure travellers",
                "Families visiting relatives",
                "Couples and leisure travellers",
                "International students",
                "Long-stay travellers",
              ],
              [
                "One-way travellers",
                "Multi-city travellers",
                "Cruise passengers",
                "Corporate travellers",
                "Frequent international travellers",
                "Travellers planning complex itineraries",
              ],
            ]
          }
          imagePosition="left"
        />

        <PlanningFactorsSection
          heading="Why Travelers Choose MultiCity Experts"
          subheading=""
          items={
            sections.IFB_WHY_CHOOSE?.items ?? [
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

        <WorkAroundYouSection
          headingLines={sections.IFB_BEYOND_SEARCH?.headingLines ?? ["International Travel Planning", "Beyond a Standard Flight", "Search."]}
          paragraphs={sections.IFB_BEYOND_SEARCH?.paragraphs ?? ["Some journeys are simple. Others aren't."]}
          rightParagraphs={
            sections.IFB_BEYOND_SEARCH?.rightParagraphs ?? [
              "If you're travelling from North America to Europe for a business meeting, combining several European cities, booking a one-way flight for a long stay or looking for Business Class options, the details matter.",
              "Our role is to help you understand those details, compare the available alternatives and choose an itinerary that makes sense for your journey.",
            ]
          }
          backgroundImage={sections.IFB_BEYOND_SEARCH?.backgroundImage ?? unsplash("1500835556837-99ac94a94552")}
        />

        <FeaturedBlockSection
          headingLines={reviewInfo?.headingLines ?? ["What Information Do We Need", "to Review Your Flight?"]}
          body={
            reviewInfo?.body ??
            "To help us understand your booking, please provide the details below. If you're unsure about some of the details, that's okay — share what you know and a travel specialist will help you from there."
          }
          images={
            reviewInfo?.images ?? [
              { src: unsplash("1573497491208-6b1acb260507"), alt: "A travel specialist smiling while consulting with a client" },
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
          heading={sections.IFB_FAQ?.heading ?? "Frequently Asked Questions"}
          faqs={sections.IFB_FAQ?.faqs ?? DEFAULT_FAQS}
        />

        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} buttonVariant="gold" />
      </main>
      <Footer />
    </>
  );
}
