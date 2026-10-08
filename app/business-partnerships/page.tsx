import type { Metadata } from "next";
import { FeaturedBlockSection } from "@/components/multi-city/FeaturedBlockSection";
// This page's step carousel, planning-factors grids and complexity
// section reuse the Multi-City Flights/Flight Cancellation pages'
// components directly (see each one's own doc comment) — all are generic
// enough (no page-specific copy baked into their JSX, only into their
// default props) that building near-identical ones here would just be
// duplication.
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { PlanningFactorsSection } from "@/components/multi-city/PlanningFactorsSection";
import { ComplexitySection } from "@/components/multi-city/ComplexitySection";
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { CancellationHero } from "@/components/flight-cancellation/CancellationHero";
import { CenteredCtaBanner } from "@/components/flight-cancellation/CenteredCtaBanner";
import { InfoBanner } from "@/components/flight-cancellation/InfoBanner";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { unsplash } from "@/lib/images";
import {
  getBusinessPartnershipsPageSeoSafely,
  getBusinessPartnershipsSectionsSafely,
} from "@/services/business-partnerships.service";
import type { Faq } from "@/data/content";

// Every section below reads its content from the database (see
// services/business-partnerships.service.ts) — revalidate periodically so
// edits made in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA` section type — `FinalCTA`'s
 * own built-in default is homepage copy, so without this, a missing section
 * here would silently show homepage content instead of this page's copy.
 * Same pattern every other page's `app/*\/page.tsx` uses. */
const DEFAULT_CTA = {
  heading: "Ready to Explore a Partnership?",
  body: "Whether you need occasional support for complex premium itineraries or are looking for a dependable B2B airfare partner, start with a conversation.",
  buttonLabel: "Request a B2B Fare Comparison",
  buttonHref: "#connect",
  backgroundImage: unsplash("1436491865332-7a61a109cc05"),
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "what-businesses-can-partner",
    question: "What types of businesses can partner with MultiCity Experts?",
    answer: "We can work with organizations that arrange or influence international travel, including travel agencies, corporate travel coordinators, luxury advisors, immigration and mobility firms, concierge businesses, event planners, education organizations, tour operators, and other professional organizations.",
  },
  {
    id: "only-business-first-class",
    question: "Do you only support Business and First Class travel?",
    answer: "Our primary B2B focus is Business and First Class international travel, particularly one-way, open-jaw, and multi-city itineraries. Specific requirements can be discussed with our team.",
  },
  {
    id: "behind-the-scenes",
    question: "Can you work behind the scenes for our business?",
    answer: "Yes. Depending on the partnership arrangement, your organization can retain the primary client relationship while our team supports airfare research and itinerary planning behind the scenes.",
  },
  {
    id: "compare-existing-fare",
    question: "Can you compare an airfare we already have?",
    answer: "Yes. You can submit an existing itinerary for review as part of a fare-comparison enquiry. We can assess the route, dates, cabin, and relevant conditions and determine whether an alternative may be available.",
  },
  {
    id: "long-term-commitment",
    question: "Do we need to commit to a long-term partnership?",
    answer: "No. You can begin by submitting an upcoming itinerary or requesting a B2B fare comparison to assess whether our expertise fits your requirements.",
  },
  {
    id: "complex-multi-city",
    question: "Can you support complex multi-city itineraries?",
    answer: "Yes. Multi-city and open-jaw travel are among the areas where specialist planning can be particularly useful. We can review different routing combinations, travel dates, airports, and itinerary requirements.",
  },
  {
    id: "one-way-business-class",
    question: "Can you assist with one-way Business Class travel?",
    answer: "Yes. One-way international Business Class is a key area of our expertise, particularly on routes involving North America, the UK, and Europe.",
  },
  {
    id: "post-booking-assistance",
    question: "Do you provide post-booking assistance?",
    answer: "Depending on the booking and partnership arrangement, we can assist with eligible post-booking requirements such as changes, cancellations, and schedule disruptions.",
  },
  {
    id: "after-hours-support",
    question: "Do you provide after-hours support?",
    answer: "Support availability depends on the partnership arrangement and the specific booking. Confirm the applicable support terms with our team before establishing your workflow.",
  },
  {
    id: "guarantee-lower-fare",
    question: "Can you guarantee a lower fare?",
    answer: "No. Airfares and availability change based on dates, inventory, airlines, routing, and fare conditions. A comparison does not guarantee a lower price or savings.",
  },
  {
    id: "represent-airlines",
    question: "Do you represent airlines?",
    answer: "No. MultiCity Experts is an independent travel consultancy and is not an airline or an airline's official customer-service department.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getBusinessPartnershipsPageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function BusinessPartnershipsPage() {
  const sections = await getBusinessPartnershipsSectionsSafely();

  const intro = sections.BP_INTRO;
  const whoWeSupport = sections.BP_WHO_WE_SUPPORT;
  const experience = sections.BP_EXPERIENCE;
  const itineraries = sections.BP_ITINERARIES;
  const moreThanFare = sections.BP_MORE_THAN_FARE;

  return (
    <>
      <Header />
      <main id="top">
        <CancellationHero
          headingLines={["Premium Airfare Expertise and", "Travel Support for Your Business"]}
          subheading=""
          paragraph="MultiCity Experts works with businesses and professional organizations that arrange international travel for clients, employees, members, or partners. We specialize in Business and First Class travel, with particular expertise in one-way, open-jaw, and multi-city itineraries between the United States, Canada, the United Kingdom, and Europe. Whether you need help with an occasional complex itinerary or are looking for dependable premium-airfare support as part of your existing operation, our travel professionals can work alongside your team."
          buttonLabel="Request a B2B Fare Comparison"
          buttonHref="#connect"
          secondaryButtonLabel="Discuss a Partnership"
          secondaryButtonHref="#connect"
          backgroundImage={unsplash("1573497491208-6b1acb260507")}
          {...sections.BP_HERO}
        />

        <FeaturedBlockSection
          headingLines={intro?.headingLines ?? ["A Specialist Air Desk", "Behind Your Business"]}
          body={
            intro?.body ??
            "International premium travel can become complicated quickly. A traveler may need to leave from one city and return to another. Dates may depend on business meetings, projects, events, or personal commitments. Different travelers may have different schedules, while one itinerary can involve multiple airlines, airports, fare conditions, and connection considerations. MultiCity Experts helps your team navigate these details. We research suitable routes, compare available options, and present clear itinerary recommendations based on the traveler's priorities. Where appropriate, we can also work behind the scenes as an extension of your organization while you maintain the primary client relationship."
          }
          images={
            intro?.images ?? [
              { src: unsplash("1714079761488-e0c9b9ac4138"), alt: "A friendly travel support specialist wearing a headset" },
            ]
          }
          imagePosition="right"
        />

        <PlanningFactorsSection
          heading="Where Our Expertise Adds Value"
          subheading=""
          items={
            sections.BP_VALUE?.items ?? [
              { id: "one-way-premium", label: "One-Way Premium Travel", description: "International one-way Business and First Class fares can vary considerably depending on the origin, destination, travel dates, routing, airline, and fare conditions. We evaluate alternative combinations to identify options that are both commercially competitive and practical for the traveler." },
              { id: "multi-city-open-jaw", label: "Multi-City & Open-Jaw Itineraries", description: "We assist with journeys involving multiple destinations, different arrival and departure cities, or separate travel requirements for members of the same party." },
              { id: "business-first-class", label: "Business & First Class", description: "Our focus on premium international travel means we consider more than the cabin itself. Journey duration, connections, operating carriers, flexibility, baggage, and post-booking requirements can all influence the right itinerary." },
              { id: "flexible-route-planning", label: "Flexible Route Planning", description: "When an initial itinerary is expensive, inconvenient, or operationally difficult, we can evaluate alternative airports, gateways, dates, airlines, and routing combinations." },
              { id: "post-booking-assistance", label: "Post-Booking Assistance", description: "Our support can extend beyond the initial reservation. Depending on the booking and applicable conditions, we can assist with changes, cancellations, schedule disruptions, and other post-booking requirements." },
              { id: "urgent-travel-support", label: "Urgent Travel Support", description: "International travel issues do not always occur during convenient business hours. Where available under the agreed partnership arrangement, confirmed clients can receive assistance with urgent, time-sensitive travel situations." },
            ]
          }
          columns={3}
        />

        <FeaturedBlockSection
          headingLines={whoWeSupport?.headingLines ?? ["Who We Support"]}
          body={whoWeSupport?.body ?? "Our partnership model may be suitable for organizations that arrange or influence international travel, including:"}
          images={
            whoWeSupport?.images ?? [
              { src: unsplash("1569629743817-70d8db6c323b"), alt: "A wide-body aircraft on final approach against a blue sky" },
            ]
          }
          twoColumnItems={
            whoWeSupport?.twoColumnItems ?? [
              ["Medical-travel facilitators and patient-coordination companies", "Luxury travel advisors and independent agencies", "Corporate travel coordinators", "Immigration and global-mobility firms", "Executive concierge companies"],
              ["Destination-wedding and event planners", "International education and study-abroad organizations", "Tour operators", "Sports, entertainment, and production companies", "Professional service firms with international clients"],
            ]
          }
          imagePosition="left"
        />

        <ComplexitySection
          heading="Support That Fits Your Existing Workflow"
          subheading="MultiCity Experts does not need to replace your current travel operation. You can involve our team when:"
          items={
            sections.BP_FITS_WORKFLOW?.items ?? [
              ["A one-way premium fare appears unusually expensive", "An itinerary includes several destinations", "Different travelers need different departure or return arrangements", "A traveler requires Business or First Class"],
              ["A proposed itinerary involves difficult or inconvenient connections", "You want an independent benchmark for an existing airfare option", "Your internal team needs additional capacity", "A confirmed traveler needs assistance with a time-sensitive issue"],
            ]
          }
          backgroundImage={sections.BP_FITS_WORKFLOW?.backgroundImage}
        />

        <PlanningFactorsSection
          heading="Partnership Models"
          subheading="The right model depends on your travel volume, internal workflow, and preferred level of involvement."
          items={
            sections.BP_MODELS?.items ?? [
              { id: "referral-support", label: "Referral Support", description: "Introduce eligible travelers to MultiCity Experts, and our team can manage the travel enquiry directly according to the communication process agreed with your organization." },
              { id: "behind-the-scenes", label: "Behind-the-Scenes Airfare Support", description: "Your organization maintains the primary client relationship while our team researches airfare and provides itinerary options for your review." },
              { id: "ongoing-air-desk", label: "Ongoing B2B Air Desk", description: "For organizations with recurring travel requirements, we can establish a structured process for itinerary requests, fare comparisons, booking coordination, and post-booking assistance." },
            ]
          }
          columns={3}
        />

        <FeaturedBlockSection
          headingLines={experience?.headingLines ?? ["B2B Travel Experience That", "Understands Your Operation"]}
          body={
            experience?.body ??
            "MultiCity Experts has more than a year of active experience supporting an established B2B travel partner. Our work has included:"
          }
          images={
            experience?.images ?? [
              { src: unsplash("1587019158091-1a103c5dd17f"), alt: "A commercial aircraft on final approach against a blue sky" },
            ]
          }
          benefits={
            experience?.benefits ?? [
              "Airfare research",
              "Complex itinerary planning",
              "Reservation coordination",
              "Booking fulfilment",
              "Post-booking travel assistance",
            ]
          }
          imagePosition="right"
        />

        <FeaturedBlockSection
          headingLines={itineraries?.headingLines ?? ["Representative International", "Itineraries"]}
          body={itineraries?.body ?? "Our team's capabilities include itineraries such as:"}
          images={
            itineraries?.images ?? [
              { src: unsplash("1502602898657-3e91760cbb34"), alt: "The Eiffel Tower rising above the rooftops of Paris at dusk" },
            ]
          }
          benefits={
            itineraries?.benefits ?? [
              "New York → Milan — one-way Business Class",
              "Milan → New York — one-way Business Class",
              "New York → London — one-way Business Class",
              "London → New York — one-way Business Class",
              "Toronto → London — Business Class",
              "New York → London → Milan → New York — multi-city Business Class",
              "United States → multiple European destinations with different return points",
            ]
          }
          imagePosition="left"
        />

        <FeaturedBlockSection
          headingLines={moreThanFare?.headingLines ?? ["More Than a", "Fare Quote"]}
          body={
            moreThanFare?.body ??
            "A lower fare has limited value if the itinerary is impractical or the traveler cannot get the support they need when plans change. Our comparisons can consider:"
          }
          images={
            moreThanFare?.images ?? [
              { src: unsplash("1569154941061-e231b4725ef1"), alt: "A commercial aircraft parked at the terminal gate before departure" },
            ]
          }
          twoColumnItems={
            moreThanFare?.twoColumnItems ?? [
              ["Total journey time", "Connection duration", "Airport changes", "Cabin and operating carrier", "Baggage provisions", "Change and cancellation conditions"],
              ["Schedule considerations", "Traveler preferences", "Companion arrangements", "Alternative airports and travel dates", "Post-booking support requirements"],
            ]
          }
          imagePosition="right"
        />

        <HowItWorksCarousel
          heading="Start With a B2B Fare-Comparison Pilot"
          subheading="Send us one or more upcoming Business or First Class itineraries, and we'll determine whether we can identify a competitive or more operationally suitable alternative."
          steps={
            sections.BP_HOW_IT_WORKS?.steps ?? [
              { id: "share-itinerary", titleLines: "Share the\nItinerary", descriptionLines: "Provide the route, travel dates,\ncabin, passenger count & flexibility." },
              { id: "evaluate-options", titleLines: "We Evaluate\nthe Options", descriptionLines: "Our team researches suitable\nfares, routes, and alternatives." },
              { id: "clear-comparison", titleLines: "Receive a Clear\nComparison", descriptionLines: "We present the relevant itinerary\ndetails, pricing & conditions." },
              { id: "decide-to-proceed", titleLines: "Decide Whether\nto Proceed", descriptionLines: "Your organization remains free\nto use its existing option." },
            ]
          }
        />

        <WhyChooseSection
          heading="Built for Complex International Travel"
          features={
            sections.BP_STRENGTHS?.features ?? [
              { id: "business-first-class", title: "Business & First Class", description: "Premium international cabin planning for travelers where comfort, schedule, and flexibility matter." },
              { id: "one-way-open-jaw", title: "One-Way & Open-Jaw", description: "Travel arrangements where a traditional return ticket does not fit the journey." },
              { id: "multi-city-travel", title: "Multi-City Travel", description: "Complex journeys involving multiple destinations, airlines, or return points." },
              { id: "north-atlantic-travel", title: "North Atlantic Travel", description: "International routes connecting the United States and Canada with the United Kingdom and Europe." },
              { id: "post-booking-support", title: "Post-Booking Support", description: "Assistance when an existing international itinerary needs attention after booking." },
            ]
          }
          variant="dark"
          cardStyle="bordered"
          layout="carousel"
        />

        <PlanningFactorsSection
          heading="Why Businesses Work With MultiCity Experts"
          subheading=""
          items={
            sections.BP_WHY_CHOOSE?.items ?? [
              { id: "independent-consultants", label: "Independent Travel Consultants", description: "We operate as an independent travel consultancy and can complement your existing travel operation." },
              { id: "international-specialists", label: "International Travel Specialists", description: "Our focus is international airfare, particularly complex premium itineraries." },
              { id: "airline-policy-guidance", label: "Airline Policy Guidance", description: "We help interpret fare conditions, airline requirements, and itinerary considerations relevant to each booking." },
              { id: "personalized-assistance", label: "Personalized Assistance", description: "Every itinerary is evaluated according to the traveler's requirements rather than a standard template." },
              { id: "human-advisors", label: "Human Travel Advisors", description: "Your team can work directly with experienced travel professionals rather than relying solely on automated search results." },
              { id: "partner-friendly", label: "Partner-Friendly Approach", description: "We understand the importance of maintaining your organization's client relationships and agreed communication processes." },
              { id: "transparent-communication", label: "Transparent Communication", description: "We clearly present relevant pricing, itinerary details, conditions, and limitations so your team can make informed decisions." },
              { id: "north-atlantic-expertise", label: "North Atlantic Expertise", description: "We have particular experience with premium international travel between North America, the UK, and Europe." },
            ]
          }
          columns={4}
        />

        <CenteredCtaBanner
          heading={sections.BP_MID_CTA?.heading ?? "Let's Explore a Business Travel Partnership"}
          subheading={
            sections.BP_MID_CTA?.subheading ??
            "If your organization arranges premium international travel, MultiCity Experts can provide specialized airfare knowledge and responsive travel assistance for the journeys that require more attention. Tell us about your current travel requirements, partnership model, or an upcoming itinerary you'd like us to review."
          }
          buttonLabel={sections.BP_MID_CTA?.buttonLabel ?? "Discuss a Business Partnership"}
          buttonHref={sections.BP_MID_CTA?.buttonHref ?? "#connect"}
        />

        <LightFaqSection
          heading={sections.BP_FAQ?.heading ?? "Frequently Asked Questions"}
          faqs={sections.BP_FAQ?.faqs ?? DEFAULT_FAQS}
        />

        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} buttonVariant="gold" />

        <InfoBanner
          tone="warning"
          heading={sections.BP_DISCLAIMER?.heading ?? "Important Information"}
          body={
            sections.BP_DISCLAIMER?.body ??
            "MultiCity Experts is an independent travel assistance and consultancy business. We are not an airline and do not represent any airline as its official customer-service department. Fare examples and potential savings are not guaranteed — airfares and availability may change until ticketing is completed, and all reservations remain subject to the operating carrier's rules, fare conditions, and availability. MultiCity Experts does not provide medical advice, medical transportation, medical escorts, or fitness-to-fly determinations. Organizations and travelers remain responsible for confirming medical clearance, accessibility requirements, and special-assistance arrangements directly with the appropriate medical professionals and operating carriers."
          }
        />
      </main>
      <Footer />
    </>
  );
}
