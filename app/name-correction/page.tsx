import type { Metadata } from "next";
import { FeaturedBlockSection } from "@/components/multi-city/FeaturedBlockSection";
// This page's step carousel, planning-factors grids and complexity
// sections reuse the Multi-City Flights/Flight Cancellation pages'
// components directly (see each one's own doc comment) — all are generic
// enough (no page-specific copy baked into their JSX, only into their
// default props) that building near-identical ones here would just be
// duplication.
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { PlanningFactorsSection } from "@/components/multi-city/PlanningFactorsSection";
import { ComplexitySection } from "@/components/multi-city/ComplexitySection";
import { MultiCityHero } from "@/components/multi-city/MultiCityHero";
import { NameCorrectionCenteredCta } from "@/components/name-correction/NameCorrectionCenteredCta";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { unsplash } from "@/lib/images";
import {
  getNameCorrectionPageSeoSafely,
  getNameCorrectionSectionsSafely,
} from "@/services/name-correction.service";
import type { Faq } from "@/data/content";

// Every section below reads its content from the database (see
// services/name-correction.service.ts) — revalidate periodically so
// edits made in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA` section type — `FinalCTA`'s
 * own built-in default is homepage copy, so without this, a missing section
 * here would silently show homepage content instead of this page's copy.
 * Same pattern every other page's `app/*\/page.tsx` uses. */
const DEFAULT_CTA = {
  heading: "Need Help Before You Fly?",
  body: "A name discrepancy doesn't always mean you need to start over with a new ticket. Before cancelling, rebooking, or assuming your ticket cannot be used, let a travel specialist review the situation with you. MultiCity Experts is an independent travel consultancy — name corrections and related changes remain subject to the applicable airline, ticket, fare, and booking-provider rules.",
  buttonLabel: "Review My Name Correction Options",
  buttonHref: "#connect",
  backgroundImage: unsplash("1436491865332-7a61a109cc05"),
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "what-is-name-correction",
    question: "What is flight name correction assistance?",
    answer: "Flight name correction assistance helps travellers understand whether a name discrepancy on an airline ticket may be correctable and what process or documentation may apply. The available options depend on the airline and booking conditions.",
  },
  {
    id: "correction-vs-change",
    question: "What's the difference between a name correction and a passenger name change?",
    answer: "A correction generally addresses an error or discrepancy in the passenger name, while a legal name change relates to a change in the passenger's legal name. Airlines may apply different rules to each.",
  },
  {
    id: "business-class-correction",
    question: "Can I correct a Business Class ticket?",
    answer: "A Business Class ticket may be eligible for a name correction depending on the airline, ticket conditions, type of correction, and other factors. We can help you understand the applicable requirements.",
  },
  {
    id: "close-to-departure",
    question: "Can I request a correction close to departure?",
    answer: "You can ask about a correction close to departure, but the available process and timeframe can vary. If you're travelling soon, contact the relevant support as early as possible.",
  },
  {
    id: "booked-elsewhere",
    question: "What happens if I booked through another travel website?",
    answer: "The appropriate correction process can depend on how your ticket was issued. We can help you understand what information you have and which booking party may need to handle the request.",
  },
  {
    id: "middle-name-mistake",
    question: "Will a middle name mistake prevent boarding?",
    answer: "Not necessarily. Whether a missing or incorrect middle name creates an issue can depend on the airline, itinerary, ticket, and applicable travel-document requirements. It's better to check rather than assume.",
  },
  {
    id: "partial-correction",
    question: "Can I correct only part of my name?",
    answer: "Some airlines may permit limited corrections while others may have different restrictions. The type and extent of the correction matter.",
  },
  {
    id: "one-letter-incorrect",
    question: "Can I travel if one letter is incorrect?",
    answer: "Do not assume that a one-letter difference is automatically acceptable or automatically invalid. The appropriate approach depends on the airline and the circumstances of the booking.",
  },
  {
    id: "exact-passport-match",
    question: "Does my airline ticket need to match my passport exactly?",
    answer: "Your passenger information should be entered carefully and consistently with the travel document you intend to use. Specific requirements can vary, so review the applicable airline rules when there is a discrepancy.",
  },
  {
    id: "documents-for-legal-change",
    question: "Do I need documents for a legal name update?",
    answer: "Supporting documentation may be required for certain legal name changes. The documents accepted can vary depending on the airline and circumstances.",
  },
  {
    id: "after-check-in",
    question: "Can a name correction be made after check-in?",
    answer: "It depends on the airline and the type of correction. If you've already checked in, contact the relevant support channel promptly rather than assuming the ticket can be changed normally.",
  },
  {
    id: "guarantee-approval",
    question: "Can you guarantee that my airline will approve the correction?",
    answer: "No. Name corrections are subject to the airline's policies, ticket conditions, documentation requirements, and approval process. We provide guidance and assistance but cannot independently approve an airline correction.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getNameCorrectionPageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function NameCorrectionPage() {
  const sections = await getNameCorrectionSectionsSafely();

  const intro = sections.NC_INTRO;
  const howWeHelp = sections.NC_HOW_WE_HELP;
  const correctionVsChange = sections.NC_CORRECTION_VS_CHANGE;
  const businessClass = sections.NC_BUSINESS_CLASS;
  const multiCity = sections.NC_MULTI_CITY;
  const urgent = sections.NC_URGENT;
  const bookedElsewhere = sections.NC_BOOKED_ELSEWHERE;
  const infoNeeded = sections.NC_INFO_NEEDED;

  return (
    <>
      <Header />
      <main id="top">
        <MultiCityHero
          headingLines={["Expert Flight Name", "Correction Assistance"]}
          paragraphs={[
            "A spelling error or legal name update doesn't always mean you need a new ticket. Our travel specialists help you understand airline name correction policies, review available options, identify required documentation, and guide you through the correction process based on your booking and the airline's rules.",
          ]}
          buttonLabel="Review My Name Correction Options"
          backgroundImage={unsplash("1573497491208-6b1acb260507")}
          {...sections.NC_HERO}
        />

        <FeaturedBlockSection
          headingLines={intro?.headingLines ?? ["Name on Your Ticket Doesn't", "Match Your Passport?"]}
          body={
            intro?.body ??
            "Even a small difference between your airline ticket and passport can create questions before check-in or departure. You may be unsure whether a spelling mistake can be corrected, whether a middle name matters, or whether a legal name update requires a different process. You don't have to figure it out alone. MultiCity Experts provides independent flight name correction assistance to help you understand your situation, review the relevant airline rules, and determine what options may be available for your booking. Whether you're travelling internationally, flying Business Class, managing a multi-city itinerary, or departing in just a few days, our specialists can help you understand the next steps."
          }
          images={
            intro?.images ?? [
              { src: unsplash("1714079761488-e0c9b9ac4138"), alt: "A friendly travel support specialist wearing a headset" },
            ]
          }
          imagePosition="right"
        />

        <FeaturedBlockSection
          headingLines={howWeHelp?.headingLines ?? ["How We Help With Flight", "Name Corrections"]}
          body={
            howWeHelp?.body ??
            "A name issue is not always as simple as changing a few letters. The appropriate process can depend on the airline, ticket conditions, type of correction, and how close you are to departure. Our travel specialists can help you:"
          }
          images={
            howWeHelp?.images ?? [
              { src: unsplash("1569629743817-70d8db6c323b"), alt: "A wide-body aircraft on final approach against a blue sky" },
            ]
          }
          benefits={
            howWeHelp?.benefits ?? [
              "Understand airline name correction policies",
              "Review your ticket and booking details",
              "Identify whether the issue appears to be a minor spelling correction or a more significant name change",
              "Understand what documents may be required",
              "Clarify the difference between a correction and a legal name update",
              "Explain airline-specific procedures",
              "Review potential options before you make changes to your booking",
              "Reduce uncertainty around potential boarding issues",
              "Navigate urgent name correction requests before departure",
            ]
          }
          imagePosition="left"
        />

        <PlanningFactorsSection
          heading="Before Requesting a Name Correction"
          subheading="Before submitting a correction request, it helps to understand exactly what has changed and how it compares with your travel documents."
          items={
            sections.NC_BEFORE_REQUEST?.items ?? [
              { id: "spelling-or-legal", label: "Is It a Spelling Correction or Legal Name Change?", description: "A minor typographical error may be handled differently from a legal change following marriage, divorce, or another official name update." },
              { id: "ticket-matches-passport", label: "Does Your Ticket Match Your Passport?", description: "Compare the passenger name on your ticket with the name shown on the passport you will use for travel." },
              { id: "check-in-opened", label: "Has Check-In Already Opened?", description: "The timing of your request can affect the available process, particularly when departure is approaching." },
              { id: "documents-required", label: "What Documents May Be Required?", description: "Depending on the situation, you may need to provide identification or supporting legal documentation." },
              { id: "departure-close", label: "Is Your Departure Close?", description: "If you're travelling soon, understanding your options early can help you avoid unnecessary last-minute uncertainty." },
              { id: "booking-source", label: "Where Did You Make the Booking?", description: "If you booked directly with an airline or through another travel website, the process for requesting a correction may differ." },
            ]
          }
          columns={3}
        />

        <PlanningFactorsSection
          heading="Common Name Correction Scenarios"
          subheading="Not every ticket name issue is the same. Here are some of the situations travellers commonly ask us about:"
          items={
            sections.NC_SCENARIOS?.items ?? [
              { id: "minor-spelling", label: "Minor Spelling Mistakes", description: "A small typographical error or incorrectly entered letter in the passenger name." },
              { id: "missing-middle-name", label: "Missing Middle Name", description: "Your middle name is missing from the ticket while it appears on your passport." },
              { id: "passport-mismatch", label: "Passport Name Mismatch", description: "The name on your booking differs from the travel document you intend to use." },
              { id: "married-surname", label: "Married Surname Update", description: "Your legal surname has changed following marriage and your existing booking reflects your previous name." },
              { id: "divorce-surname", label: "Divorce-Related Surname Update", description: "Your legal name has changed following divorce and your ticket needs to be reviewed against your current documentation." },
              { id: "typographical-errors", label: "Typographical Errors", description: "Extra, missing, or incorrectly entered characters in the passenger name." },
              { id: "reversed-names", label: "Reversed First and Last Names", description: "Your first and last names appear in the wrong order on the booking." },
              { id: "incorrect-title", label: "Incorrect Title or Initials", description: "A title or initial has been entered incorrectly, where the airline's rules allow such corrections." },
            ]
          }
          columns={4}
        />

        <PlanningFactorsSection
          heading="Understanding Airline Name Correction Policies"
          subheading="Airlines do not all handle passenger name corrections in the same way. Policies can vary based on:"
          items={
            sections.NC_POLICIES_TABLE?.items ?? [
              { id: "airline", label: "Airline", description: "Each airline may have its own name correction procedures and restrictions." },
              { id: "ticket-type", label: "Ticket Type", description: "Fare and ticket conditions can affect available options." },
              { id: "type-of-correction", label: "Type of Correction", description: "A spelling correction may be treated differently from a legal name change." },
              { id: "time-before-departure", label: "Time Before Departure", description: "Requests made close to departure may require more urgent attention." },
              { id: "booking-channel", label: "Booking Channel", description: "The process may differ depending on where the ticket was purchased." },
              { id: "itinerary", label: "Itinerary", description: "Multi-city, connecting, or multiple-airline journeys can introduce additional considerations." },
            ]
          }
          columns={3}
        />

        <FeaturedBlockSection
          headingLines={correctionVsChange?.headingLines ?? ["Name Correction vs. Name Change:", "What's the Difference?"]}
          body={
            correctionVsChange?.body ??
            "These terms are sometimes used interchangeably, but they can refer to different situations. A name correction generally relates to an error or discrepancy in the passenger name, such as a typographical mistake or reversed name order. A legal name change involves a passenger whose legal name has changed and may require supporting documentation. The distinction matters because airlines can apply different rules to each situation. If you're unsure which category your booking falls into, our specialists can help you understand what information and documentation may be relevant before you proceed."
          }
          images={
            correctionVsChange?.images ?? [
              { src: unsplash("1587019158091-1a103c5dd17f"), alt: "A commercial aircraft on final approach against a blue sky" },
            ]
          }
          imagePosition="left"
        />

        <ComplexitySection
          heading="Name Correction for International Flights"
          subheading="International travel can make ticket name issues more important because your airline booking needs to be considered alongside your passport and other travel documentation. We can assist travellers with questions involving:"
          items={
            sections.NC_INTERNATIONAL?.items ?? [
              ["International one-way flights", "Return journeys", "Multi-city itineraries", "Connecting international flights", "Business Class tickets", "Premium cabin bookings"],
              ["Family travel", "Student travel", "Corporate travel", "Complex international itineraries", "North Atlantic routes between North America and the UK or Europe"],
            ]
          }
          backgroundImage={sections.NC_INTERNATIONAL?.backgroundImage}
        />

        <FeaturedBlockSection
          headingLines={businessClass?.headingLines ?? ["Business Class Ticket", "Name Correction"]}
          body={
            businessClass?.body ??
            "A Business Class ticket deserves the same careful attention as any other international booking — but the value and complexity of the itinerary can make it especially important to review the available options before taking action. Our specialists can help you understand:"
          }
          images={
            businessClass?.images ?? [
              { src: unsplash("1569154941061-e231b4725ef1"), alt: "A commercial aircraft parked at the terminal gate before departure" },
            ]
          }
          benefits={
            businessClass?.benefits ?? [
              "Whether your ticket may be eligible for a correction",
              "What the airline's applicable rules say",
              "Whether supporting documentation may be required",
              "How the correction process may work",
              "What to consider if departure is approaching",
              "Whether your itinerary includes multiple airlines or connections",
            ]
          }
          imagePosition="right"
        />

        <FeaturedBlockSection
          headingLines={multiCity?.headingLines ?? ["Name Corrections on Multi-City", "& Complex Itineraries"]}
          body={
            multiCity?.body ??
            "A name issue can become more complicated when your journey includes several flights, destinations, or airlines. For example, a journey such as New York → London → Paris → Rome → New York may involve multiple flight sectors and potentially different operating or ticketing arrangements. Before making any changes, it can be useful to understand how the name issue relates to the complete itinerary. Our specialists can review the broader journey and help you understand what needs attention, particularly when your booking includes multiple sectors, international connections, or Business Class travel."
          }
          images={
            multiCity?.images ?? [
              { src: unsplash("1502602898657-3e91760cbb34"), alt: "The Eiffel Tower rising above the rooftops of Paris at dusk" },
            ]
          }
          imagePosition="left"
        />

        <HowItWorksCarousel
          heading="What Happens When You Contact Us?"
          subheading="We keep the process straightforward and focused on understanding your specific situation."
          steps={
            sections.NC_HOW_IT_WORKS?.steps ?? [
              { id: "tell-us-booking", titleLines: "Tell Us About\nYour Booking", descriptionLines: "Share your itinerary, airline,\ndeparture date & the name issue." },
              { id: "review-details", titleLines: "We Review Your\nDetails", descriptionLines: "Our specialists review the ticket\nand relevant airline policies." },
              { id: "confirm-documentation", titleLines: "Confirm Potential\nDocumentation", descriptionLines: "We explain what identification\nmay be relevant to your situation." },
              { id: "understand-options", titleLines: "Understand Your\nOptions", descriptionLines: "We clarify the available correction\npathways based on your booking." },
              { id: "assist-through-process", titleLines: "Assist You Through\nthe Process", descriptionLines: "We guide you through the next\nsteps and keep you informed." },
            ]
          }
        />

        <FeaturedBlockSection
          headingLines={urgent?.headingLines ?? ["What If Your Flight Is", "Only a Few Days Away?"]}
          body={
            urgent?.body ??
            "A name discrepancy can feel particularly stressful when departure is approaching. If you're travelling soon, don't assume that the ticket is unusable or immediately purchase another ticket without first understanding the situation. Our specialists can help you review:"
          }
          images={
            urgent?.images ?? [
              { src: unsplash("1530521954074-e64f6810b32d"), alt: "A business traveller relaxing at the gate as an aircraft departs" },
            ]
          }
          benefits={
            urgent?.benefits ?? [
              "The exact name discrepancy",
              "Your departure date and time",
              "The airline involved",
              "Your ticket details",
              "Applicable correction procedures",
              "Documentation that may be required",
              "Potential next steps",
            ]
          }
          buttonLabel={urgent?.buttonLabel ?? "Need Help Before You Fly?"}
          buttonHref={urgent?.buttonHref ?? "#connect"}
          imagePosition="right"
        />

        <FeaturedBlockSection
          headingLines={bookedElsewhere?.headingLines ?? ["Booked Through Another", "Travel Website?"]}
          body={
            bookedElsewhere?.body ??
            "If your flight was booked through another travel website, agency, or provider, you may be unsure who should handle the correction. The appropriate contact can depend on how the ticket was issued and the booking arrangement. MultiCity Experts can help you understand the situation and identify what information may be needed before you approach the relevant provider. If you have your confirmation and ticket details available, our specialists can review the information with you."
          }
          images={
            bookedElsewhere?.images ?? [
              { src: unsplash("1714079761488-e0c9b9ac4138"), alt: "A friendly travel support specialist wearing a headset" },
            ]
          }
          imagePosition="left"
        />

        <ComplexitySection
          heading="Tips to Avoid Ticket Name Problems"
          subheading="The easiest name correction is often the one you never need to request. When booking an international flight:"
          items={
            sections.NC_TIPS?.items ?? [
              ["Match your passenger name carefully with your passport.", "Double-check spelling before completing payment.", "Enter your full legal name where required by the booking process.", "Review the passenger details immediately after receiving your confirmation."],
              ["Check the name on every ticketed sector of a complex itinerary.", "Contact the relevant support team as soon as you notice an error.", "Avoid assuming that a minor difference is either acceptable or automatically a problem — check the applicable airline rules."],
            ]
          }
          backgroundImage={sections.NC_TIPS?.backgroundImage ?? unsplash("1500835556837-99ac94a94552")}
        />

        <PlanningFactorsSection
          heading="Why Travellers Choose MultiCity Experts"
          subheading=""
          items={
            sections.NC_WHY_CHOOSE?.items ?? [
              { id: "independent-consultants", label: "Independent Travel Consultants", description: "We provide independent guidance rather than presenting ourselves as the airline or ticketing authority." },
              { id: "international-specialists", label: "International Travel Specialists", description: "Our expertise is focused on international journeys and the details that can make them more complex." },
              { id: "airline-policy-guidance", label: "Airline Policy Guidance", description: "We help travellers understand airline-specific requirements and potential correction procedures." },
              { id: "personalised-assistance", label: "Personalised Assistance", description: "Your booking, itinerary, documents, and circumstances are considered together rather than through a generic process." },
              { id: "human-advisors", label: "Human Travel Advisors", description: "Speak with experienced travel specialists who can discuss your situation and explain the next steps." },
              { id: "secure-document-handling", label: "Secure Document Handling", description: "When documentation is required, we treat travel information with appropriate care and confidentiality." },
              { id: "post-booking-support", label: "Post-Booking Support", description: "Our assistance extends beyond the initial flight purchase when you need help understanding a booking issue." },
              { id: "transparent-communication", label: "Transparent Communication", description: "We explain what we know, what may be required, and what remains subject to airline approval." },
              { id: "north-atlantic-expertise", label: "North Atlantic Expertise", description: "We assist with international journeys between North America and the UK and Europe, including complex connecting and multi-city itineraries." },
            ]
          }
          columns={3}
        />

        <FeaturedBlockSection
          headingLines={infoNeeded?.headingLines ?? ["What Information", "Do We Need?"]}
          body={infoNeeded?.body ?? "To understand your name correction situation, it helps to have the details below."}
          images={
            infoNeeded?.images ?? [
              { src: unsplash("1573497491208-6b1acb260507"), alt: "A travel specialist smiling while consulting with a client" },
            ]
          }
          twoColumnItems={
            infoNeeded?.twoColumnItems ?? [
              ["Passenger name as shown on the ticket", "Correct name as shown on your passport", "Airline name", "Booking or ticket details", "Departure date"],
              ["Flight route", "Whether the journey is one-way, return, or multi-city", "Cabin class", "Details of the name discrepancy", "Any relevant supporting documentation, where applicable"],
            ]
          }
          buttonLabel={infoNeeded?.buttonLabel ?? "Check My Ticket Eligibility"}
          buttonHref={infoNeeded?.buttonHref ?? "#connect"}
          imagePosition="left"
        />

        <NameCorrectionCenteredCta
          heading={sections.NC_REQUEST_FORM?.heading}
          subheading={sections.NC_REQUEST_FORM?.subheading}
          buttonLabel={sections.NC_REQUEST_FORM?.buttonLabel}
          disclaimer={sections.NC_REQUEST_FORM?.disclaimer}
        />

        <LightFaqSection
          heading={sections.NC_FAQ?.heading ?? "Frequently Asked Questions"}
          faqs={sections.NC_FAQ?.faqs ?? DEFAULT_FAQS}
        />

        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} buttonVariant="gold" />
      </main>
      <Footer />
    </>
  );
}
