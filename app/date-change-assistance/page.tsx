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
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { DateChangeCenteredCta } from "@/components/date-change/DateChangeCenteredCta";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { unsplash } from "@/lib/images";
import {
  getDateChangeAssistancePageSeoSafely,
  getDateChangeAssistanceSectionsSafely,
} from "@/services/date-change-assistance.service";
import type { Faq } from "@/data/content";

// Every section below reads its content from the database (see
// services/date-change-assistance.service.ts) — revalidate periodically
// so edits made in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA` section type — `FinalCTA`'s
 * own built-in default is homepage copy, so without this, a missing section
 * here would silently show homepage content instead of this page's copy.
 * Same pattern every other page's `app/*\/page.tsx` uses. */
const DEFAULT_CTA = {
  heading: "Need to Change Your Travel Date?",
  body: "Before you confirm a new date, make sure you understand your options. Tell us what has changed, when you'd prefer to travel and what matters most to you — our specialists can help you explore alternative dates, flights, routes and fare conditions.",
  buttonLabel: "Review My Date Change Options",
  buttonHref: "#connect",
  backgroundImage: unsplash("1500835556837-99ac94a94552"),
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "can-i-change-date",
    question: "Can I change the date of my international flight?",
    answer: "Possibly. Whether a date change is permitted depends on the airline, route, fare type and ticket conditions.",
  },
  {
    id: "change-cost",
    question: "How much does it cost to change a flight date?",
    answer: "The cost can depend on the applicable change conditions and the fare difference between your original and new flight. There is no single fee that applies to every ticket.",
  },
  {
    id: "change-or-cancel",
    question: "Should I change my date or cancel my ticket?",
    answer: "It depends on your fare conditions and revised travel plans. We can help you compare the available options before you decide.",
  },
  {
    id: "earlier-date",
    question: "Can I move my trip to an earlier date?",
    answer: "Potentially. Earlier flights may be available depending on the airline, route, ticket conditions and available inventory.",
  },
  {
    id: "later-date",
    question: "Can I move my trip to a later date?",
    answer: "Potentially. Later travel dates may be available subject to the applicable fare rules and flight availability.",
  },
  {
    id: "one-passenger",
    question: "Can I change only one passenger's travel date?",
    answer: "In some situations, individual passengers may be handled separately, but this depends on the booking structure and airline rules.",
  },
  {
    id: "one-sector-multi-city",
    question: "Can I change one part of a multi-city itinerary?",
    answer: "It may be possible, but changing one sector can affect the remaining itinerary. The complete booking should be reviewed before making a change.",
  },
  {
    id: "business-class-change",
    question: "Can I change a Business Class booking?",
    answer: "Yes, Business Class bookings may be changeable, but the specific fare conditions determine what is permitted and what costs may apply.",
  },
  {
    id: "cheaper-fare",
    question: "What happens if the new date is cheaper?",
    answer: "If a replacement flight has a lower fare, the treatment of the difference depends on the airline's fare rules and ticket conditions. A lower fare does not automatically mean you will receive the difference as a refund.",
  },
  {
    id: "change-airport",
    question: "Can I change my departure airport at the same time?",
    answer: "It may be possible depending on the airline, ticket conditions and available routing. Changing airports can also affect the fare and overall itinerary.",
  },
  {
    id: "same-day-change",
    question: "Can I change my flight to the same day?",
    answer: "Same-day changes may be available for certain tickets and routes. Availability and applicable charges depend on the airline and fare conditions.",
  },
  {
    id: "airline-changed-date",
    question: "What if my airline changed my travel date?",
    answer: "An airline-initiated schedule change can be treated differently from a voluntary date change. The options available depend on the airline's policy and the circumstances of the change.",
  },
  {
    id: "non-refundable-change",
    question: "Can I change a non-refundable ticket?",
    answer: "A non-refundable ticket may still permit certain changes. The exact conditions depend on the airline and fare purchased.",
  },
  {
    id: "flexible-fare-guarantee",
    question: "Do flexible fares guarantee free date changes?",
    answer: "No. A flexible fare may provide greater change flexibility, but the exact conditions vary by airline and fare type.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDateChangeAssistancePageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function DateChangeAssistancePage() {
  const sections = await getDateChangeAssistanceSectionsSafely();

  const businessClass = sections.DC_BUSINESS_CLASS;
  const multiCity = sections.DC_MULTI_CITY;
  const infoNeeded = sections.DC_INFO_NEEDED;

  return (
    <>
      <Header />
      <main id="top">
        <MultiCityHero
          headingLines={["Need to Change Your Travel Dates?", "Let's Explore Your Options."]}
          paragraphs={[
            "Travel plans can change for all kinds of reasons. A business meeting moves, a visa is delayed, holiday dates shift, or you simply need to travel earlier or later than planned.",
            "Before changing your booking, it's worth understanding what your ticket allows and how different travel dates may affect the fare, routing and availability. Our travel specialists help you review available dates, understand fare conditions and compare suitable alternatives so you can make a more informed decision about your journey.",
          ]}
          buttonLabel="Review My Date Change Options"
          backgroundImage={unsplash("1573497491208-6b1acb260507")}
          {...sections.DC_HERO}
        />

        <PlanningFactorsSection
          heading="Expert Assistance for International Flight Date Changes"
          subheading="Changing a travel date can involve more than finding another flight. Your options may depend on airline, route, original fare, ticket conditions, new travel date, flight availability, fare difference, change conditions, cabin class and remaining itinerary sectors. We help you understand these factors and explore the alternatives available for your journey."
          items={
            sections.DC_EXPERT_GUIDANCE?.items ?? [
              { id: "airline-policy-guidance", label: "Airline Policy Guidance", description: "Understand the relevant conditions attached to your flight booking." },
              { id: "fare-rule-guidance", label: "Fare Rule Guidance", description: "Review how your ticket conditions may affect a date change." },
              { id: "international-expertise", label: "International Travel Expertise", description: "Support for complex international routes across North America, the UK and Europe." },
              { id: "personal-advisors", label: "Personal Travel Advisors", description: "Discuss your revised plans with a real travel specialist." },
            ]
          }
          columns={4}
        />

        <PlanningFactorsSection
          heading="Understanding Your Date Change Options"
          subheading="When your plans change, there may be more than one way to adjust your journey. Our specialists can help you:"
          items={
            sections.DC_UNDERSTANDING_OPTIONS?.items ?? [
              { id: "review-fare-rules", label: "Review Airline Fare Rules", description: "Understand the conditions that apply to your existing ticket." },
              { id: "compare-dates", label: "Compare Travel Dates", description: "Explore alternative dates that may fit your revised schedule." },
              { id: "fare-differences", label: "Understand Fare Differences", description: "A permitted date change may still involve a difference between your original fare and the new flight." },
              { id: "flexible-tickets", label: "Explore Flexible Ticket Options", description: "If flexibility is important, we can help you understand available fare choices." },
              { id: "alternative-airports", label: "Consider Alternative Airports", description: "A different departure or arrival airport may provide additional options depending on your route." },
              { id: "nearby-departures", label: "Review Nearby Departures", description: "Alternative flights or airports may be worth considering when your preferred date has limited availability." },
              { id: "business-class-availability", label: "Explore Business Class Availability", description: "If you're already changing your itinerary, you may want to compare premium-cabin options." },
              { id: "airline-policies", label: "Understand Airline Policies", description: "Change conditions vary between airlines, routes and ticket types." },
            ]
          }
          columns={4}
        />

        <PlanningFactorsSection
          heading="Before You Change Your Travel Date"
          subheading="Changing your date isn't always the only — or necessarily the most suitable — option. Before confirming a change, consider:"
          items={
            sections.DC_BEFORE_CHANGE?.items ?? [
              { id: "change-or-cancel", label: "Should You Change the Date or Cancel?", description: "Depending on your ticket conditions and revised plans, changing the booking may be more suitable than cancelling it. In other situations, cancellation may make more sense." },
              { id: "another-airport", label: "Could Another Airport Work Better?", description: "If your preferred date has limited availability, an alternative departure or arrival airport may open up additional possibilities." },
              { id: "one-segment", label: "Can You Change Only One Flight Segment?", description: "For more complex itineraries, it may be possible to review individual sectors rather than treating the entire journey as one change. This depends on the ticket structure and airline rules." },
              { id: "same-day-travel", label: "Is Same-Day Travel Available?", description: "If you need to move your trip urgently, later or earlier flights on the same day may be worth exploring where available." },
              { id: "flexible-fare-help", label: "Would a Flexible Fare Help?", description: "If your plans are likely to change again, understanding flexible fare options before making a change can be useful." },
              { id: "cabin-change-help", label: "Would Changing Cabin Class Help?", description: "If availability is limited in your current cabin, you may want to compare other cabin options." },
            ]
          }
          columns={3}
        />

        <WhyChooseSection
          heading="Common Reasons Travellers Change Their Travel Dates"
          features={
            sections.DC_COMMON_REASONS?.features ?? [
              { id: "business-schedule-changes", title: "Business Schedule Changes", description: "A meeting, conference or work commitment has moved, and you need to adjust your international travel." },
              { id: "family-emergencies", title: "Family Emergencies", description: "An unexpected family situation may require you to postpone or bring forward your journey." },
              { id: "holiday-plan-changes", title: "Holiday Plan Changes", description: "Your leave dates have changed or your plans have shifted." },
              { id: "visa-delays", title: "Visa Delays", description: "A delayed visa or travel document may mean your original departure date is no longer practical." },
              { id: "medical-reasons", title: "Medical Reasons", description: "A medical situation may require your travel plans to be reconsidered." },
              { id: "event-postponements", title: "Event Postponements", description: "A wedding, conference, celebration or other important event has moved." },
              { id: "multi-city-changes", title: "Multi-City Itinerary Changes", description: "Changing one destination or date may affect several other sectors of your journey." },
              { id: "cruise-schedule-changes", title: "Cruise Schedule Changes", description: "If your travel is connected to a cruise, changes to the cruise schedule can affect your international flights." },
            ]
          }
          variant="dark"
          cardStyle="bordered"
          layout="carousel"
        />

        <PlanningFactorsSection
          heading="Understanding Airline Fare Rules"
          subheading="Your ability to change a travel date depends on the conditions attached to your ticket. Fare rules vary by airline, route, ticket and travel date — we help you understand the conditions that apply to your specific journey."
          items={
            sections.DC_FARE_RULES?.items ?? [
              { id: "flexible-fares", label: "Flexible Fares", description: "Designed to provide greater flexibility, subject to the specific fare conditions." },
              { id: "standard-fares", label: "Standard Fares", description: "May allow certain changes but can include fees, restrictions or fare differences." },
              { id: "restricted-fares", label: "Restricted Fares", description: "Often come with more limitations around date changes and other modifications." },
              { id: "refundable-fares", label: "Refundable Fares", description: "May provide refund options under the applicable conditions, although refundability does not mean every change is free." },
              { id: "non-refundable-fares", label: "Non-Refundable Fares", description: "A non-refundable ticket may still permit certain changes depending on the airline and fare conditions." },
              { id: "fare-differences", label: "Fare Differences", description: "Even where a date change is permitted, the replacement flight may have a different fare. This difference can affect the total cost." },
            ]
          }
          columns={3}
        />

        <ComplexitySection
          heading="Why Your New Travel Date Matters"
          subheading="Changing your travel date can affect more than your departure day. A different date may change:"
          items={
            sections.DC_WHY_DATE_MATTERS?.items ?? [
              ["Flight availability", "Airline options", "Departure times", "Connection times"],
              ["Fare levels", "Cabin availability", "Airport choices", "Overall journey duration"],
            ]
          }
          backgroundImage={sections.DC_WHY_DATE_MATTERS?.backgroundImage}
        />

        <FeaturedBlockSection
          headingLines={businessClass?.headingLines ?? ["Business Class Flight", "Date Changes"]}
          body={
            businessClass?.body ??
            "Business Class travellers may have additional itinerary considerations when changing dates. A premium cabin does not automatically mean the ticket is fully flexible or refundable — the applicable fare conditions still determine what changes are possible. We can help you review:"
          }
          images={
            businessClass?.images ?? [
              { src: unsplash("1587019158091-1a103c5dd17f"), alt: "A commercial aircraft on final approach against a blue sky" },
            ]
          }
          benefits={
            businessClass?.benefits ?? [
              "Business Class date change conditions",
              "Alternative Business Class flights",
              "Fare differences",
              "Earlier or later departures",
              "Different routing",
              "Alternative airports",
              "One-way Business Class options",
              "Multi-city Business Class changes",
            ]
          }
          imagePosition="left"
        />

        <FeaturedBlockSection
          headingLines={multiCity?.headingLines ?? ["Changing Dates on a", "Multi-City Itinerary"]}
          body={
            multiCity?.body ??
            "Changing the date of one flight can affect the rest of a multi-city journey. For example, on a New York → London → Paris → Rome itinerary, moving the London flight by two days may mean also reconsidering:"
          }
          images={
            multiCity?.images ?? [
              { src: unsplash("1502602898657-3e91760cbb34"), alt: "The Eiffel Tower rising above the rooftops of Paris at dusk" },
            ]
          }
          benefits={
            multiCity?.benefits ?? [
              "London–Paris travel",
              "Paris–Rome travel",
              "Hotel arrangements",
              "Remaining flight sectors",
              "Return journey",
              "Fare conditions",
            ]
          }
          imagePosition="right"
        />

        <ComplexitySection
          heading="When Can MultiCity Experts Help?"
          subheading=""
          listIntro="You may need flight date change assistance if:"
          items={
            sections.DC_URGENT_HELP?.items ?? [
              [
                "You need to postpone your trip.",
                "You need to travel earlier.",
                "Your business meeting was rescheduled.",
                "Your holiday dates changed.",
                "Your visa was delayed.",
              ],
              [
                "Your cruise departure changed.",
                "One traveller can no longer travel on the original date.",
                "Your Business Class availability has changed.",
                "Your multi-city itinerary needs to be adjusted.",
                "You aren't sure whether changing the date is the right option.",
              ],
            ]
          }
          backgroundImage={sections.DC_URGENT_HELP?.backgroundImage ?? ""}
          align="center"
        />

        <HowItWorksCarousel
          heading="How Our Flight Date Change Assistance Works"
          subheading="A clear process from the moment you tell us what's changed."
          steps={
            sections.DC_HOW_IT_WORKS?.steps ?? [
              { id: "tell-us-booking", titleLines: "Tell Us About\nYour Booking", descriptionLines: "Share your existing itinerary, original\ntravel date and what you need to change." },
              { id: "review-fare-conditions", titleLines: "We Review Your\nFare Conditions", descriptionLines: "Our specialists review the relevant\nticket conditions and airline policies." },
              { id: "compare-dates", titleLines: "We Compare\nAlternative Dates", descriptionLines: "We explore available travel dates,\nflights, routes and fare implications." },
              { id: "review-options", titleLines: "Review Your\nOptions", descriptionLines: "We explain the alternatives so you can\ncompare timing, routing and cost." },
              { id: "choose-itinerary", titleLines: "Choose Your Preferred\nItinerary", descriptionLines: "You decide which option best\nfits your revised plans." },
              { id: "receive-details", titleLines: "Receive Updated\nTravel Details", descriptionLines: "Once confirmed, you receive updated\nbooking information and support." },
            ]
          }
        />

        <PlanningFactorsSection
          heading="Why Travellers Choose MultiCity Experts"
          subheading=""
          items={
            sections.DC_WHY_CHOOSE?.items ?? [
              { id: "independent-consultants", label: "Independent Travel Consultants", description: "We provide travel guidance independently rather than presenting ourselves as an airline." },
              { id: "international-specialists", label: "International Flight Specialists", description: "Experience with international routes and more complex travel requirements." },
              { id: "fare-rule-guidance", label: "Airline Fare Rule Guidance", description: "Help understanding the conditions attached to your ticket." },
              { id: "personalised-support", label: "Personalised Itinerary Support", description: "Your revised travel plans and priorities remain at the centre of the process." },
              { id: "business-class-expertise", label: "Business Class Expertise", description: "Guidance for premium-cabin travellers changing international travel dates." },
              { id: "multi-city-specialists", label: "Multi-City Specialists", description: "Support when changing one date can affect several parts of an itinerary." },
              { id: "flexible-fare-guidance", label: "Flexible Fare Guidance", description: "Understand the flexibility available before confirming your revised journey." },
              { id: "human-advisors", label: "Human Travel Advisors", description: "Speak directly with a specialist about your travel situation." },
              { id: "post-booking-assistance", label: "Post-Booking Assistance", description: "Where applicable, support can continue after your itinerary has been changed." },
            ]
          }
          columns={3}
        />

        <FeaturedBlockSection
          headingLines={infoNeeded?.headingLines ?? ["What Information", "Do We Need?"]}
          body={
            infoNeeded?.body ??
            "To review your date change options, it helps to provide the details below. If you don't know your new date yet, that's okay — tell us when you need to travel and how flexible you can be."
          }
          images={
            infoNeeded?.images ?? [
              { src: unsplash("1714079761488-e0c9b9ac4138"), alt: "A friendly travel support specialist wearing a headset" },
            ]
          }
          twoColumnItems={
            infoNeeded?.twoColumnItems ?? [
              ["Airline", "Booking reference", "Departure city", "Destination", "Original travel date", "Preferred new date"],
              ["Number of passengers", "Cabin class", "One-way, return or multi-city", "Whether your dates are flexible", "Preferred departure time", "Any other travel requirements"],
            ]
          }
          imagePosition="left"
        />

        <DateChangeCenteredCta
          heading={sections.DC_REQUEST_FORM?.heading}
          subheading={sections.DC_REQUEST_FORM?.subheading}
          buttonLabel={sections.DC_REQUEST_FORM?.buttonLabel}
          disclaimer={sections.DC_REQUEST_FORM?.disclaimer}
        />

        <LightFaqSection
          heading={sections.DC_FAQ?.heading ?? "Frequently Asked Questions"}
          faqs={sections.DC_FAQ?.faqs ?? DEFAULT_FAQS}
        />

        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} buttonVariant="gold" />
      </main>
      <Footer />
    </>
  );
}
