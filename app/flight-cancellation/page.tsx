import type { Metadata } from "next";
import { CancellationHero } from "@/components/flight-cancellation/CancellationHero";
import { CenteredCtaBanner } from "@/components/flight-cancellation/CenteredCtaBanner";
import { ComparisonColumnsSection } from "@/components/flight-cancellation/ComparisonColumnsSection";
import { InfoBanner } from "@/components/flight-cancellation/InfoBanner";
import { RefundVsCreditSection } from "@/components/flight-cancellation/RefundVsCreditSection";
import { ScheduleChangeSection } from "@/components/flight-cancellation/ScheduleChangeSection";
import { StepsListCarousel } from "@/components/flight-cancellation/StepsListCarousel";
import { ComplexitySection } from "@/components/multi-city/ComplexitySection";
import { FeaturedBlockSection } from "@/components/multi-city/FeaturedBlockSection";
// This page's "how it works" carousel and planning-factors grid reuse the
// Multi-City Flights page's components directly (see each one's own doc
// comment) — both are generic enough (no multi-city-specific copy baked
// into their JSX, only into their default props) that building near-identical
// ones here would just be duplication.
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { PlanningFactorsSection } from "@/components/multi-city/PlanningFactorsSection";
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { unsplash } from "@/lib/images";
import {
  getFlightCancellationPageSeoSafely,
  getFlightCancellationSectionsSafely,
} from "@/services/flight-cancellation.service";
import type { Faq, ServiceCard } from "@/data/content";

// Every section below reads its content from the database (see
// services/flight-cancellation.service.ts) — revalidate periodically so
// edits made in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA` section type — `FinalCTA`'s
 * own built-in default is homepage copy, so without this, a missing section
 * here would silently show homepage content instead of this page's copy.
 * Same pattern `app/first-class/page.tsx`/`app/multi-city-flights/page.tsx`
 * use. */
const DEFAULT_CTA = {
  heading: "Before You Cancel, Know Your Options",
  body: "Your plans may have changed, but cancellation may not be your only path forward. Tell us what happened, and our travel specialists can help you review relevant flight cancellation, flight change, rebooking, refund and travel-credit options based on your booking.",
  buttonLabel: "Speak With a Travel Specialist",
  buttonHref: "#connect",
  backgroundImage: unsplash("1474302770737-173ee21bab63"),
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "refund-eligibility",
    question: "Can I cancel my flight and get a refund?",
    answer:
      "It depends on the fare rules attached to your ticket. Some fares are refundable, others allow travel credit, and some carry cancellation fees or no refund at all.",
  },
  {
    id: "airline-cancelled",
    question: "What happens if the airline cancels my flight?",
    answer:
      "An airline-initiated cancellation or schedule change is treated differently from a passenger-initiated cancellation, and often opens up options like rebooking or a refund regardless of your original fare type.",
  },
  {
    id: "change-instead",
    question: "Can I change my flight instead of canceling?",
    answer:
      "Often yes. Depending on your fare, changing dates or routing may be possible, sometimes for a fee or fare difference, and may be worth considering before cancelling outright.",
  },
  {
    id: "fare-refundable",
    question: "How do I know if my fare is refundable?",
    answer:
      "Refundability is determined by the specific fare purchased, not simply the airline or cabin class. We can help you review your ticket conditions.",
  },
  {
    id: "travel-credit",
    question: "Can I get a travel credit after cancellation?",
    answer:
      "In many cases, yes — eligible ticket value may be retained as travel credit for future use, subject to the airline's conditions and expiration date.",
  },
  {
    id: "last-minute",
    question: "What happens if my flight is cancelled at the last minute?",
    answer:
      "We can help you understand your immediate options, including rebooking on the next available flight or reviewing refund eligibility for the disruption.",
  },
  {
    id: "alternative-flight",
    question: "Can you help me find an alternative flight?",
    answer:
      "Yes — our specialists can help review alternative routing, connections and airlines if your original flight is no longer a good fit.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getFlightCancellationPageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function FlightCancellationPage() {
  const sections = await getFlightCancellationSectionsSafely();
  const seo = await getFlightCancellationPageSeoSafely();

  const intro = sections.CNX_INTRO;
  const entireBooking = sections.CNX_ENTIRE_BOOKING;
  const premiumCabin = sections.CNX_PREMIUM_CABIN;

  const notOnlyOptionServices: ServiceCard[] = sections.CNX_NOT_ONLY_OPTION?.services ?? [
    {
      id: "flight-changes",
      category: "Flight Changes",
      title: "Flight Changes",
      description: "Already booked and need to adjust your dates or routing? Explore flight change options for your existing booking.",
      image: unsplash("1569629743817-70d8db6c323b"),
      alt: "A wide-body aircraft on final approach against a blue sky",
      href: "#connect",
    },
    {
      id: "rebooking-assistance",
      category: "Rebooking",
      title: "Rebooking Assistance",
      description: "If your plans or your airline's schedule has changed, we can help you review suitable rebooking options.",
      image: unsplash("1714079761488-e0c9b9ac4138"),
      alt: "A friendly travel support specialist wearing a headset",
      href: "#connect",
    },
    {
      id: "multi-city-assistance",
      category: "Multi-City",
      title: "Multi-City Assistance",
      description: "Need to adjust one leg of a multi-city itinerary? We review how a change affects the rest of your journey.",
      image: unsplash("1500835556837-99ac94a94552"),
      alt: "View from an aircraft window over clouds lit by a golden sunset",
      href: "#connect",
    },
  ];

  return (
    <>
      <JsonLd data={seo?.schemaData} />
      <Header />
      <main id="top">
        <CancellationHero {...sections.CNX_HERO} />

        <FeaturedBlockSection
          headingLines={intro?.headingLines ?? ["Independent Flight Cancellation", "& Refund Assistance"]}
          body={intro?.body ?? "When your plans change, understanding your ticket conditions can help you make a more informed decision."}
          images={intro?.images ?? [{ src: unsplash("1714079761488-e0c9b9ac4138"), alt: "A friendly travel support specialist wearing a headset" }]}
          twoColumnItems={
            intro?.twoColumnItems ?? [
              ["Independent travel consultancy", "Flight cancellation guidance", "Refund and travel-credit guidance", "Airline policy assistance"],
              ["International travel specialists", "Personal travel advisors", "Before and after booking support"],
            ]
          }
          buttonLabel={intro?.buttonLabel ?? "Speak With a Travel Specialist"}
          buttonHref={intro?.buttonHref ?? "#connect"}
          buttonVariant="navy"
          imagePosition="right"
        />

        <PlanningFactorsSection
          heading="Why Do You Need to Cancel or Change Your Flight"
          subheading="The reason your plans changed can affect which options may be available under your ticket and the airline's applicable conditions."
          items={
            sections.CNX_WHY_CANCEL?.items ?? [
              { id: "family-emergency", label: "Family Emergency", description: "An unexpected family situation requiring a sudden change of plans." },
              { id: "business-schedule", label: "Business Schedule Change", description: "A shifted meeting or project timeline affecting your travel dates." },
              { id: "airline-schedule", label: "Airline Schedule Change", description: "The airline adjusted your departure time, routing or operating flight." },
              { id: "visa-issue", label: "Visa Issue", description: "A delayed or denied visa affecting your ability to travel as planned." },
              { id: "medical-situation", label: "Medical Situation", description: "A health issue affecting you or a travel companion." },
              { id: "itinerary-change", label: "Multi-City Itinerary Change", description: "One leg of a multi-city trip no longer fits your plans." },
              { id: "missed-connection", label: "Missed Connection", description: "A missed or disrupted connection affecting the rest of your journey." },
              { id: "change-of-plans", label: "Change of Plans", description: "Personal circumstances that simply no longer fit the original itinerary." },
            ]
          }
          columns={4}
        />

        <WhyChooseSection
          heading="Before You Cancel Your Flight, Check These Options"
          features={
            sections.CNX_CHECK_OPTIONS?.features ?? [
              { id: "change-dates", title: "Can You Change\nYour Travel Dates?", description: "If you still want to travel but your dates have changed, a flight change or rebooking may be worth considering." },
              { id: "refundable", title: "Is Your Ticket\nRefundable", description: "Refund eligibility depends on your fare conditions, not simply your airline or cabin class." },
              { id: "travel-credit", title: "Would Travel\nCredit Be Useful", description: "Retaining eligible ticket value as travel credit may suit your plans better than a refund." },
              { id: "dummy-carousel-test", title: "Dummy Item", description: "Temporary 4th card so the carousel has something to slide to — remove once you've seen it." },
            ]
          }
          variant="dark"
          cardStyle="bordered"
          layout="carousel"
        />

        <ComparisonColumnsSection
          heading={sections.CNX_CANCEL_VS_REBOOK?.heading}
          subheading={sections.CNX_CANCEL_VS_REBOOK?.subheading}
          groupOne={
            sections.CNX_CANCEL_VS_REBOOK
              ? {
                  heading: sections.CNX_CANCEL_VS_REBOOK.groupOneHeading,
                  intro: sections.CNX_CANCEL_VS_REBOOK.groupOneIntro,
                  columnA: sections.CNX_CANCEL_VS_REBOOK.groupOneColumnA,
                  columnB: sections.CNX_CANCEL_VS_REBOOK.groupOneColumnB,
                }
              : undefined
          }
          groupTwo={
            sections.CNX_CANCEL_VS_REBOOK
              ? {
                  heading: sections.CNX_CANCEL_VS_REBOOK.groupTwoHeading,
                  intro: sections.CNX_CANCEL_VS_REBOOK.groupTwoIntro,
                  columnA: sections.CNX_CANCEL_VS_REBOOK.groupTwoColumnA,
                  columnB: sections.CNX_CANCEL_VS_REBOOK.groupTwoColumnB,
                }
              : undefined
          }
        />

        <RefundVsCreditSection
          {...sections.CNX_REFUND_VS_CREDIT}
          refund={sections.CNX_REFUND_BLOCK}
          credit={sections.CNX_CREDIT_BLOCK}
        />

        <InfoBanner tone="cta" {...sections.CNX_CREDIT_BANNER} />

        <ScheduleChangeSection {...sections.CNX_SCHEDULE_CHANGE} />

        <FeaturedBlockSection
          headingLines={entireBooking?.headingLines ?? ["Do You Need to Cancel", "the Entire Booking?"]}
          body={
            entireBooking?.body ??
            "Sometimes only one part of a reservation is affected. For complex international bookings, cancelling the entire itinerary without reviewing the ticket structure first could affect other passengers, flight segments, fares or remaining travel."
          }
          images={entireBooking?.images ?? [{ src: unsplash("1569154941061-e231b4725ef1"), alt: "A passenger's premium business class seat and workspace in flight" }]}
          twoColumnItems={
            entireBooking?.twoColumnItems ?? [
              ["One passenger, not the full booking", "One flight segment", "One direction only"],
              ["A cabin or class change", "The remaining itinerary kept intact", "Every passenger on the booking"],
            ]
          }
          imagePosition="right"
        />

        <PlanningFactorsSection
          heading="What Should You Check Before Cancelling a Flight?"
          subheading="Before cancelling an international flight, review the conditions attached to your ticket."
          items={
            sections.CNX_BEFORE_CANCELLING?.items ?? [
              { id: "refund-eligibility", label: "Refund Eligibility", description: "Whether your fare permits a cash refund at all." },
              { id: "cancellation-fees", label: "Cancellation Fees", description: "Any fees the airline applies for cancelling your ticket." },
              { id: "fare-conditions", label: "Fare Conditions", description: "The specific rules attached to the fare you purchased." },
              { id: "airline-policies", label: "Airline Policies", description: "How the operating airline handles cancellations and changes." },
              { id: "travel-insurance", label: "Travel Insurance", description: "Whether a policy you hold covers your reason for cancelling." },
              { id: "rebooking-options", label: "Rebooking Options", description: "Whether changing dates or routing is a better fit than cancelling." },
              { id: "credit-voucher", label: "Credit/Voucher Options", description: "Whether eligible value can be retained as future travel credit." },
              { id: "schedule-changes", label: "Schedule Changes", description: "Whether the airline, not you, changed the original schedule." },
            ]
          }
          columns={4}
        />

        <InfoBanner tone="warning" {...sections.CNX_FARE_WARNING} />

        <FeaturedBlockSection
          headingLines={premiumCabin?.headingLines ?? ["Cancelling Business Class", "or First Class Flights"]}
          body={
            premiumCabin?.body ??
            "Premium travel does not automatically mean your ticket is refundable. Business Class and First Class fares can have different conditions depending on the fare brand, ticket type, route and airline."
          }
          images={premiumCabin?.images ?? [{ src: unsplash("1587019158091-1a103c5dd17f"), alt: "Close-up detail of a first-class seat and personal suite" }]}
          twoColumnItems={
            premiumCabin?.twoColumnItems ?? [
              ["Fare brand", "Refundability", "Ticket value", "Flexible-fare conditions"],
              ["Airline-specific restrictions", "Multi-city fare construction", "Loyalty or upgrade implications"],
            ]
          }
          imagePosition="left"
        />

        <HowItWorksCarousel
          heading="How Our Flight Cancellation Assistance Works"
          subheading="A clear path from your booking to your best available option."
          steps={
            sections.CNX_HOW_IT_WORKS?.steps ?? [
              { id: "tell-us", titleLines: "Tell Us About\nYour Booking", descriptionLines: "Share what changed and\nwhatever details you know." },
              { id: "review-conditions", titleLines: "We Review Your\nTicket Conditions", descriptionLines: "Fare rules, refund eligibility\nand applicable policies." },
              { id: "compare-options", titleLines: "We Compare\nthe Options", descriptionLines: "Cancellation, change or\nrebooking — side by side." },
            ]
          }
        />

        <ComplexitySection
          heading="Not Sure What to Do? Tell Us What Happened."
          subheading="You don't need to know exactly which airline rule applies before contacting us."
          listIntro="Simply tell us what changed:"
          items={
            sections.CNX_NOT_SURE?.items ?? [
              [
                "My business meeting has been postponed.",
                "My visa hasn't arrived.",
                "My airline changed my connection.",
                "One person in my family can't travel.",
              ],
              [
                "I have a Business Class ticket and don't understand the fare rules.",
                "I only need to cancel part of my itinerary.",
                "I've been offered travel credit but don't know whether to accept it.",
                "I still want to travel, but on different dates.",
              ],
            ]
          }
          backgroundImage={sections.CNX_NOT_SURE?.backgroundImage ?? ""}
          align="center"
        />

        <PlanningFactorsSection
          heading="Why Choose MultiCity Experts for Flight Cancellation Help?"
          subheading=""
          items={
            sections.CNX_WHY_CHOOSE?.items ?? [
              { id: "arrival-departure", label: "Arrival & Departure Cities", description: "How your routing shapes which options are still available." },
              { id: "destinations", label: "Destinations", description: "Whether every stop on your itinerary is still affected the same way." },
              { id: "travel-time", label: "Travel Time", description: "How much flexibility remains in your schedule." },
              { id: "flight-structure", label: "Flight Structure", description: "One-way, round-trip or multi-city — each behaves differently." },
              { id: "cabin-preference", label: "Cabin Preference", description: "Whether your cabin affects your fare's cancellation conditions." },
              { id: "fare-flexibility", label: "Fare Flexibility", description: "What your specific fare actually allows." },
              { id: "airline-policies", label: "Airline Policies", description: "How your operating airline applies its own rules." },
              { id: "refund-timing", label: "Refund Timing", description: "How long a refund or credit may take to process." },
              { id: "next-steps", label: "Next Steps", description: "What to do next, in plain terms, once we understand your booking." },
            ]
          }
          columns={3}
        />

        <ServicesCarousel
          heading="Flight Cancellation Isn't Your Only Option"
          subheading="Before cancelling, consider whether another solution could work better for your journey."
          services={notOnlyOptionServices}
          linkLabel="Learn More"
        />

        <ComparisonColumnsSection
          heading={sections.CNX_REVIEW_INFO?.heading ?? "What Information Do We Need to Review Your Booking?"}
          subheading={
            sections.CNX_REVIEW_INFO?.subheading ??
            "You don't need to understand airline fare rules before contacting us. Providing the following information can help us understand your situation more clearly."
          }
          groupOne={{
            heading: sections.CNX_REVIEW_INFO?.groupOneHeading ?? "Booking Details",
            intro: sections.CNX_REVIEW_INFO?.groupOneIntro,
            columnA: sections.CNX_REVIEW_INFO?.groupOneColumnA ?? "Airline\nBooking reference\nDeparture city\nDestination",
            columnB: sections.CNX_REVIEW_INFO?.groupOneColumnB ?? "Departure date\nNumber of passengers\nCabin class",
          }}
          groupTwo={{
            heading: sections.CNX_REVIEW_INFO?.groupTwoHeading ?? "What Changed?",
            intro: sections.CNX_REVIEW_INFO?.groupTwoIntro,
            columnA:
              sections.CNX_REVIEW_INFO?.groupTwoColumnA ??
              "Reason your plans changed\nWhether the ticket is refundable — Yes / No / Unsure\nWhether the airline changed the schedule — Yes / No",
            columnB:
              sections.CNX_REVIEW_INFO?.groupTwoColumnB ??
              "Whether you still intend to travel\nFlexible new dates\nWhether it's a multi-city itinerary\nAny additional details",
          }}
        />

        <StepsListCarousel {...sections.CNX_REVIEW_STEPS} />

        <CenteredCtaBanner {...sections.CNX_PLAN_CTA} />

        <LightFaqSection
          heading={sections.CNX_FAQ?.heading ?? "Flight Cancellation FAQs"}
          faqs={sections.CNX_FAQ?.faqs ?? DEFAULT_FAQS}
        />

        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} buttonVariant="gold" />
      </main>
      <Footer />
    </>
  );
}
