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
import { MultiCityHero } from "@/components/multi-city/MultiCityHero";
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { CenteredCtaBanner } from "@/components/flight-cancellation/CenteredCtaBanner";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { unsplash } from "@/lib/images";
import {
  getScheduleChangesPageSeoSafely,
  getScheduleChangesSectionsSafely,
} from "@/services/schedule-changes.service";
import type { Faq } from "@/data/content";

// Every section below reads its content from the database (see
// services/schedule-changes.service.ts) — revalidate periodically so
// edits made in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA` section type — `FinalCTA`'s
 * own built-in default is homepage copy, so without this, a missing section
 * here would silently show homepage content instead of this page's copy.
 * Same pattern every other page's `app/*\/page.tsx` uses. */
const DEFAULT_CTA = {
  heading: "Your Airline Changed the Schedule. Know Your Options.",
  body: "A schedule change doesn't necessarily mean you have to accept the first revised itinerary you receive. Whether your departure time changed, your connection no longer works, your airport was moved or your multi-city journey has been disrupted, our specialists can help you review the situation and explore the available alternatives.",
  buttonLabel: "Review My Schedule Change Options",
  buttonHref: "#connect",
  backgroundImage: unsplash("1436491865332-7a61a109cc05"),
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "departure-time-changed",
    question: "What should I do if the airline changes my departure time?",
    answer:
      "Review the revised itinerary carefully, including your connections, airports and arrival time. If the new schedule no longer works, you can explore what alternatives may be available under the airline's applicable policy.",
  },
  {
    id: "request-different-flight",
    question: "Can I request a different flight after a schedule change?",
    answer: "Potentially. Alternative flights may be available depending on the airline's policy, the nature of the change, your ticket conditions and available flights.",
  },
  {
    id: "new-schedule-doesnt-work",
    question: "What if the new schedule no longer works for me?",
    answer: "You may have options depending on the circumstances and applicable airline policy. We can help you review the revised itinerary and explore possible alternatives.",
  },
  {
    id: "keep-business-class",
    question: "Can I keep my Business Class cabin?",
    answer: "If an alternative itinerary is available, the cabin offered depends on the airline, route, aircraft and inventory. Business Class availability should be confirmed for the specific alternative.",
  },
  {
    id: "connections-after-change",
    question: "What happens to my connections after a schedule change?",
    answer: "A schedule change can affect the practicality of your connection. Review the connection time, airport and terminal requirements before accepting the revised itinerary.",
  },
  {
    id: "change-one-part",
    question: "Can I change only one part of my itinerary?",
    answer: "It may be possible depending on how your booking is structured and the airline's applicable conditions. Multi-city and complex itineraries should be reviewed as a whole.",
  },
  {
    id: "airport-changed",
    question: "What if the airline changes my airport?",
    answer: "An airport change can affect transportation, accommodation and connecting flights. Review the full itinerary and available alternatives before deciding whether the revised arrangement works.",
  },
  {
    id: "baggage-arrangements",
    question: "Will my baggage arrangements change?",
    answer: "Baggage arrangements can depend on the airline, ticket, route and revised itinerary. If your routing or airlines have changed, confirm how your baggage will be handled.",
  },
  {
    id: "aircraft-change-business-class",
    question: "Can an aircraft change affect my Business Class experience?",
    answer: "Yes. Different aircraft can have different cabin layouts, seats and onboard products. If the aircraft matters to you, check the revised aircraft and cabin configuration where available.",
  },
  {
    id: "refund-after-change",
    question: "Can I request a refund after an airline schedule change?",
    answer: "Refund eligibility depends on the airline's policy, the nature of the schedule change and your ticket conditions. A refund should not be assumed without checking the applicable rules.",
  },
  {
    id: "travel-credit-instead",
    question: "Can I receive a travel credit instead?",
    answer: "Some airlines may offer travel credits under specific circumstances. Availability and conditions vary by airline and ticket.",
  },
  {
    id: "affects-multi-city",
    question: "What if the schedule change affects my multi-city itinerary?",
    answer: "A change to one sector may affect subsequent flights, connections and return travel. The complete itinerary should be reviewed before making changes elsewhere.",
  },
  {
    id: "free-change",
    question: "Does an airline schedule change automatically mean I can change my flight for free?",
    answer: "Not necessarily. The available options depend on the airline's policy and the circumstances of the schedule change. Any applicable terms should be confirmed before making a change.",
  },
  {
    id: "guarantee-alternative",
    question: "Can you guarantee an alternative flight?",
    answer: "No. Alternative flights depend on airline policies, ticket conditions, route availability and remaining inventory.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getScheduleChangesPageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function ScheduleChangesPage() {
  const sections = await getScheduleChangesSectionsSafely();

  const whatMeans = sections.SC_WHAT_MEANS;
  const multiCity = sections.SC_MULTI_CITY;
  const businessClass = sections.SC_BUSINESS_CLASS;
  const oneWay = sections.SC_ONE_WAY;
  const infoNeeded = sections.SC_INFO_NEEDED;

  return (
    <>
      <Header />
      <main id="top">
        <MultiCityHero
          headingLines={["Did the Airline Change Your Flight?", "Let's Review Your Options."]}
          paragraphs={[
            "Airline schedule changes can affect much more than your departure time. A new schedule may create a difficult connection, change your airport, alter your aircraft, affect your cabin or disrupt the rest of a multi-city itinerary.",
            "Before simply accepting the revised itinerary, it can help to understand what has changed and what alternatives may be available. Our travel specialists help you review the updated itinerary, understand applicable airline policies and compare suitable options based on your travel plans.",
          ]}
          buttonLabel="Review My Schedule Change Options"
          backgroundImage={unsplash("1573497491208-6b1acb260507")}
          {...sections.SC_HERO}
        />

        <FeaturedBlockSection
          headingLines={whatMeans?.headingLines ?? ["What Does an Airline Schedule", "Change Mean for Your Journey?"]}
          body={
            whatMeans?.body ??
            "An airline schedule change happens when a carrier modifies an existing flight after you've booked. The change may be relatively minor — or it may affect the way your entire journey works. Depending on the situation, you may encounter:"
          }
          images={
            whatMeans?.images ?? [
              { src: unsplash("1569629743817-70d8db6c323b"), alt: "A wide-body aircraft on final approach against a blue sky" },
            ]
          }
          twoColumnItems={
            whatMeans?.twoColumnItems ?? [
              ["An earlier departure", "A later departure", "A different arrival time", "A flight number change", "An aircraft change"],
              ["A different departure or arrival airport", "A changed connection", "A revised route", "Changes affecting multiple sectors"],
            ]
          }
          buttonLabel={whatMeans?.buttonLabel ?? "Review My Schedule Change Options"}
          buttonHref={whatMeans?.buttonHref ?? "#connect"}
          imagePosition="right"
        />

        <PlanningFactorsSection
          heading="Understanding Different Types of Flight Schedule Changes"
          subheading=""
          items={
            sections.SC_TYPES?.items ?? [
              { id: "minor-time-changes", label: "Minor Time Changes", description: "A small adjustment to your departure or arrival time may not significantly affect your plans. However, it's still worth checking your connections and onward travel." },
              { id: "major-schedule-changes", label: "Major Schedule Changes", description: "A larger timing adjustment may affect airport transfers, hotel arrangements, meetings or other parts of your journey." },
              { id: "flight-number-changes", label: "Flight Number Changes", description: "An airline may change the flight number associated with your itinerary. Check the updated booking carefully to understand what else has changed." },
              { id: "aircraft-changes", label: "Aircraft Changes", description: "The airline may substitute the aircraft operating your flight. This can matter particularly to travellers who have selected Business Class or are concerned about a particular cabin configuration." },
              { id: "airport-changes", label: "Airport Changes", description: "A change in departure or arrival airport can have a significant practical impact, particularly when accommodation, ground transportation or connecting flights are involved." },
              { id: "connection-changes", label: "Connection Changes", description: "A revised schedule can shorten or lengthen your connection. Even when every individual flight remains available, the overall itinerary may no longer work as originally planned." },
              { id: "route-changes", label: "Route Changes", description: "Changes to the operating route or flight structure may affect your onward travel and the overall journey." },
            ]
          }
          columns={4}
        />

        <PlanningFactorsSection
          heading="Before You Accept an Airline Schedule Change"
          subheading="An updated itinerary isn't automatically the best itinerary for you. Before accepting the revised schedule, consider:"
          items={
            sections.SC_BEFORE_ACCEPT?.items ?? [
              { id: "connection-still-works", label: "Does the New Connection Still Work?", description: "Check how much time you have between flights and whether the connection remains practical." },
              { id: "airport-changed", label: "Has Your Airport Changed?", description: "A different terminal or airport can affect ground transportation, accommodation and onward travel." },
              { id: "aircraft-changed", label: "Has the Aircraft Changed?", description: "If you're travelling in Business Class or First Class, an aircraft change may also mean a different cabin configuration." },
              { id: "cabin-same", label: "Is Your Cabin Still the Same?", description: "Check whether your revised itinerary still reflects the cabin you originally selected." },
              { id: "journey-longer", label: "Has the Journey Become Longer?", description: "A new routing may add additional travel time, waiting periods or an overnight connection." },
              { id: "better-alternatives", label: "Are There Better Alternative Flights?", description: "Depending on the airline's policies and available options, another flight may work better with your plans." },
              { id: "affects-other-sectors", label: "Does the Change Affect Other Sectors?", description: "If you have a multi-city itinerary, changing one flight can affect several others." },
              { id: "different-itinerary", label: "Would a Different Itinerary Work Better?", description: "In some circumstances, an alternative routing, airport or travel time may be worth considering." },
            ]
          }
          columns={4}
        />

        <WhyChooseSection
          heading="How We Help With Airline Schedule Changes"
          features={
            sections.SC_HOW_WE_HELP?.features ?? [
              { id: "review-airline-changes", title: "Review the Airline's Changes", description: "Understand what has changed in your original itinerary." },
              { id: "check-updated-journey", title: "Check Your Updated Journey", description: "Look beyond the affected flight and consider the rest of your trip." },
              { id: "understand-ticket-conditions", title: "Understand Ticket Conditions", description: "Review the fare and booking conditions relevant to your itinerary." },
              { id: "compare-alternative-flights", title: "Compare Alternative Flights", description: "Explore other available schedules and routing options where applicable." },
              { id: "evaluate-connection-times", title: "Evaluate Connection Times", description: "Consider whether your new connections are practical for the airport and journey involved." },
              { id: "review-airport-changes", title: "Review Airport Changes", description: "Understand how a new departure or arrival airport may affect your plans." },
              { id: "consider-cabin-preferences", title: "Consider Cabin Preferences", description: "For premium travellers, we can help review available Business Class or other cabin alternatives." },
              { id: "understand-fare-implications", title: "Understand Potential Fare Implications", description: "Where applicable, understand how alternative travel arrangements may affect the fare or ticket conditions." },
            ]
          }
          variant="dark"
          cardStyle="bordered"
          layout="carousel"
        />

        <PlanningFactorsSection
          heading="Common Airline Schedule Change Scenarios"
          subheading=""
          items={
            sections.SC_SCENARIOS?.items ?? [
              { id: "leaves-earlier", label: "Your Flight Leaves Earlier", description: "An earlier departure may affect your airport transfer, hotel arrangements or ability to reach the airport on time." },
              { id: "leaves-later", label: "Your Flight Leaves Later", description: "A later departure may create a longer journey or affect onward connections." },
              { id: "connection-no-longer-works", label: "Your Connection No Longer Works", description: "The revised schedule may leave too little time — or an unnecessarily long wait — between flights." },
              { id: "airport-changed", label: "Your Airport Has Changed", description: "A new departure or arrival airport can affect transportation, accommodation and the rest of your itinerary." },
              { id: "aircraft-changed", label: "Your Aircraft Has Changed", description: "An aircraft substitution may affect the cabin or onboard experience, particularly for premium travellers." },
              { id: "same-day-travel-changed", label: "Your Same-Day Travel Has Changed", description: "A revised departure may affect meetings, events, cruise departures or other time-sensitive plans." },
              { id: "multi-city-affected", label: "Your Multi-City Journey Has Been Affected", description: "One changed sector can have consequences for subsequent destinations and return travel." },
              { id: "business-trip-disrupted", label: "Your Business Trip Has Been Disrupted", description: "A schedule change can interfere with meetings, conferences and other fixed commitments." },
            ]
          }
          columns={4}
        />

        <WhyChooseSection
          heading="What Are Your Options After an Airline Schedule Change?"
          features={
            sections.SC_OPTIONS?.features ?? [
              { id: "accept-revised", title: "Accept the Revised Itinerary", description: "If the new schedule still works for you, you may choose to continue with the revised booking." },
              { id: "explore-alternative", title: "Explore an Alternative Flight", description: "Depending on the airline's applicable policy, another flight may be worth considering." },
              { id: "different-departure-times", title: "Review Different Departure Times", description: "A different flight time may better fit your original plans." },
              { id: "alternative-routing", title: "Consider Alternative Routing", description: "Another route may provide a more practical connection or overall journey." },
              { id: "refund-eligibility", title: "Review Refund Eligibility", description: "In certain circumstances, airline policies may provide refund options. Eligibility depends on the applicable rules and circumstances." },
              { id: "travel-credit", title: "Explore Travel Credit", description: "Where offered, a travel credit may be another possibility depending on the airline and ticket conditions." },
            ]
          }
          variant="dark"
          cardStyle="bordered"
          layout="carousel"
        />

        <FeaturedBlockSection
          headingLines={multiCity?.headingLines ?? ["Airline Schedule Changes &", "Multi-City Itineraries"]}
          body={
            multiCity?.body ??
            "Schedule changes can become more complicated when your journey includes several destinations. For example, on a New York → London → Paris → Rome itinerary, if the New York–London schedule changes, it could affect:"
          }
          images={
            multiCity?.images ?? [
              { src: unsplash("1502602898657-3e91760cbb34"), alt: "The Eiffel Tower rising above the rooftops of Paris at dusk" },
            ]
          }
          benefits={
            multiCity?.benefits ?? [
              "Your London connection",
              "Arrival time in Paris",
              "Your Paris–Rome sector",
              "Hotel arrangements",
              "Ground transportation",
              "Return travel",
              "The overall itinerary",
            ]
          }
          buttonLabel={multiCity?.buttonLabel ?? "Explore Multi-City Travel Assistance"}
          buttonHref={multiCity?.buttonHref ?? "/multi-city-flights"}
          imagePosition="left"
        />

        <FeaturedBlockSection
          headingLines={businessClass?.headingLines ?? ["Business Class", "Schedule Changes"]}
          body={
            businessClass?.body ??
            "For Business Class travellers, an airline schedule change can affect more than timing. A Business Class ticket does not automatically guarantee a particular aircraft, seat or schedule after an airline changes its operation. You may also want to consider:"
          }
          images={
            businessClass?.images ?? [
              { src: unsplash("1587019158091-1a103c5dd17f"), alt: "A commercial aircraft on final approach against a blue sky" },
            ]
          }
          benefits={
            businessClass?.benefits ?? [
              "Whether your Business Class cabin remains available",
              "Aircraft changes",
              "Seat or cabin configuration",
              "Connection times",
              "Alternative premium-cabin flights",
              "Different routing",
              "Arrival and departure times",
              "Overall journey convenience",
            ]
          }
          buttonLabel={businessClass?.buttonLabel ?? "Explore Business Class Travel"}
          buttonHref={businessClass?.buttonHref ?? "/business-class"}
          imagePosition="right"
        />

        <FeaturedBlockSection
          headingLines={oneWay?.headingLines ?? ["Airline Schedule Changes for", "One-Way Travel"]}
          body={
            oneWay?.body ??
            "If you're travelling one-way, a schedule change can have a different impact because there may be no return sector on the same booking. We can help you review:"
          }
          images={
            oneWay?.images ?? [
              { src: unsplash("1530521954074-e64f6810b32d"), alt: "A business traveller relaxing at the gate as an aircraft departs" },
            ]
          }
          benefits={
            oneWay?.benefits ?? [
              "Revised departure times",
              "Alternative routing",
              "Different departure airports",
              "Connection requirements",
              "Fare conditions",
              "Business Class alternatives",
              "New travel arrangements where necessary",
            ]
          }
          buttonLabel={oneWay?.buttonLabel ?? "Explore One-Way Travel"}
          buttonHref={oneWay?.buttonHref ?? "#connect"}
          imagePosition="left"
        />

        <ComplexitySection
          heading="When Can MultiCity Experts Help?"
          subheading=""
          listIntro="You may want schedule change assistance if:"
          items={
            sections.SC_URGENT_HELP?.items ?? [
              [
                "Your airline changed your departure time.",
                "Your arrival time no longer works.",
                "Your connection has become impractical.",
                "Your airline moved your flight to another airport.",
                "Your aircraft was changed.",
              ],
              [
                "Your Business Class itinerary was affected.",
                "Your multi-city itinerary no longer works.",
                "Your business meeting is affected.",
                "Your cruise connection is at risk.",
                "You don't understand the alternatives offered by the airline.",
              ],
            ]
          }
          backgroundImage={sections.SC_URGENT_HELP?.backgroundImage ?? ""}
          align="center"
        />

        <HowItWorksCarousel
          heading="How Our Schedule Change Assistance Works"
          subheading="A clear process from the moment you tell us what's changed."
          steps={
            sections.SC_HOW_IT_WORKS?.steps ?? [
              { id: "tell-us-changed", titleLines: "Tell Us What\nChanged", descriptionLines: "Share your original itinerary and\nthe revised schedule from the airline." },
              { id: "review-journey", titleLines: "We Review Your\nJourney", descriptionLines: "Our specialists look at connections,\nairports and ticket conditions." },
              { id: "explore-alternatives", titleLines: "We Explore Available\nAlternatives", descriptionLines: "We compare suitable flight times,\nroutes and cabin options." },
              { id: "review-options", titleLines: "Review Your\nOptions", descriptionLines: "We explain the practical differences\nso you can decide what fits." },
              { id: "confirm-path", titleLines: "Confirm Your\nPreferred Path", descriptionLines: "The applicable airline process\ndetermines the next steps." },
              { id: "ongoing-assistance", titleLines: "Receive Ongoing\nAssistance", descriptionLines: "We can continue to assist with\nsubsequent travel requirements." },
            ]
          }
        />

        <PlanningFactorsSection
          heading="Why Travellers Choose MultiCity Experts"
          subheading=""
          items={
            sections.SC_WHY_CHOOSE?.items ?? [
              { id: "independent-consultants", label: "Independent Travel Consultants", description: "We provide travel guidance independently and are not an airline." },
              { id: "north-atlantic-specialists", label: "North Atlantic Specialists", description: "Our expertise includes international travel between North America, the UK and Europe." },
              { id: "schedule-change-guidance", label: "Schedule Change Guidance", description: "We help travellers understand how airline changes may affect their wider journey." },
              { id: "personal-itinerary-support", label: "Personal Itinerary Support", description: "We look at the complete itinerary rather than only the affected flight." },
              { id: "business-class-expertise", label: "Business Class Expertise", description: "Additional guidance for premium travellers whose cabin or aircraft may be affected." },
              { id: "multi-city-knowledge", label: "Multi-City Knowledge", description: "Experience with itineraries where one schedule change can affect several destinations." },
              { id: "flexible-fare-guidance", label: "Flexible Fare Guidance", description: "Help understanding the conditions that apply to alternative travel options." },
              { id: "human-advisors", label: "Human Travel Advisors", description: "Speak directly with a travel specialist about your specific situation." },
              { id: "post-booking-assistance", label: "Post-Booking Assistance", description: "Support can continue where applicable after your original itinerary has been booked." },
            ]
          }
          columns={3}
        />

        <FeaturedBlockSection
          headingLines={infoNeeded?.headingLines ?? ["What Information", "Should You Provide?"]}
          body={infoNeeded?.body ?? "To help us review your schedule change, please provide the details below. If you're unsure what information matters, send us the schedule change you've received and we'll start from there."}
          images={
            infoNeeded?.images ?? [
              { src: unsplash("1714079761488-e0c9b9ac4138"), alt: "A friendly travel support specialist wearing a headset" },
            ]
          }
          twoColumnItems={
            infoNeeded?.twoColumnItems ?? [
              ["Airline", "Booking reference", "Original flight number", "Revised flight number, if applicable", "Original departure date and time", "New departure date and time", "Departure airport"],
              ["Destination", "Connecting airport, if applicable", "Number of travellers", "Cabin class", "Remaining itinerary sectors", "What concerns you about the change", "Any important meetings, events or connections", "Preferred alternative travel times, if known"],
            ]
          }
          imagePosition="left"
        />

        <CenteredCtaBanner
          heading={sections.SC_REVIEW_CTA?.heading ?? "Your Airline Changed the Plan. Let's Review Yours."}
          subheading={
            sections.SC_REVIEW_CTA?.subheading ??
            "Don't assume the revised itinerary is your only option. Tell us what changed and what matters most to you — our travel specialists can help you understand the updated journey, explore available alternatives and make a more informed decision."
          }
          buttonLabel={sections.SC_REVIEW_CTA?.buttonLabel ?? "Review My Schedule Change"}
          buttonHref={sections.SC_REVIEW_CTA?.buttonHref ?? "#connect"}
        />

        <LightFaqSection
          heading={sections.SC_FAQ?.heading ?? "Frequently Asked Questions"}
          faqs={sections.SC_FAQ?.faqs ?? DEFAULT_FAQS}
        />

        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} buttonVariant="gold" />
      </main>
      <Footer />
    </>
  );
}
