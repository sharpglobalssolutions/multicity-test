import type { Metadata } from "next";
import { FeaturedBlockSection } from "@/components/multi-city/FeaturedBlockSection";
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { MultiCityHero } from "@/components/multi-city/MultiCityHero";
import { PlanningFactorsSection } from "@/components/multi-city/PlanningFactorsSection";
import { WhyChooseSection } from "@/components/multi-city/WhyChooseSection";
import { ComplexitySection } from "@/components/multi-city/ComplexitySection";
import { InfoBanner } from "@/components/flight-cancellation/InfoBanner";
import { CenteredCtaBanner } from "@/components/flight-cancellation/CenteredCtaBanner";
import { ItineraryComparisonSection } from "@/components/one-way-flights/ItineraryComparisonSection";
import { RouteFlowCompareSection } from "@/components/one-way-flights/RouteFlowCompareSection";
import { ChecklistSection } from "@/components/one-way-flights/ChecklistSection";
import { OneWayFlightsRequestForm } from "@/components/one-way-flights/OneWayFlightsRequestForm";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { unsplash } from "@/lib/images";
import type { Faq } from "@/data/content";

export const metadata: Metadata = {
  title: "One-Way & Open-Jaw Flights | MultiCityExperts",
  description:
    "Explore one-way and open-jaw flight options across North America, the UK and Europe. Our travel specialists help you compare routes, airlines and fares around the way you actually want to travel.",
};

const FAQS: Faq[] = [
  {
    id: "what-is-open-jaw",
    question: "What is an open-jaw flight?",
    answer:
      "An open-jaw itinerary generally allows you to arrive in one city and return from another rather than using the same city for both international directions.",
  },
  {
    id: "one-way-vs-open-jaw",
    question: "What is the difference between one-way and open-jaw travel?",
    answer:
      "A one-way itinerary covers travel in one direction. An open-jaw itinerary generally includes outbound and return international travel while using different arrival and departure cities.",
  },
  {
    id: "london-paris",
    question: "Can I fly into London and return from Paris?",
    answer:
      "Depending on the airlines, travel dates, routing and ticketing options, this type of itinerary may be possible.",
  },
  {
    id: "different-countries",
    question: "Can I fly into one European country and return from another?",
    answer:
      "Yes, suitable itinerary structures may be available depending on your destinations, airlines, dates and routing.",
  },
  {
    id: "rail-combo",
    question: "Can I combine European rail travel with an open-jaw flight?",
    answer:
      "Yes. Many travellers use international flights for the beginning and end of their journey while travelling between European destinations independently.",
  },
  {
    id: "business-class-open-jaw",
    question: "Can I book Business Class on an open-jaw itinerary?",
    answer:
      "Business Class may be available on one or more sectors depending on the route, airline, travel date and availability.",
  },
  {
    id: "different-airlines",
    question: "Can I use different airlines for the outbound and return?",
    answer:
      "Different airline combinations may be possible depending on the itinerary and ticketing structure.",
  },
  {
    id: "open-jaw-vs-multi-city",
    question: "Is open-jaw the same as multi-city?",
    answer:
      "No. They are related but not identical. Open-jaw travel generally involves arriving in one city and departing from another, while a multi-city itinerary can contain several separately planned flight sectors.",
  },
  {
    id: "one-way-pricing",
    question: "Are one-way international flights more expensive?",
    answer:
      "Pricing varies by airline, route, cabin, travel dates and fare structure. One-way fares should be compared with other suitable itinerary options rather than assuming they will always cost more or less.",
  },
  {
    id: "dont-know-return",
    question: "Can you help if I don't know where I should fly home from?",
    answer:
      "Yes. Tell us which destinations you're considering, and our specialists can help explore departure cities that may fit the overall journey.",
  },
  {
    id: "multiple-destinations",
    question: "Can I include multiple destinations?",
    answer:
      "Yes. If your journey involves several cities, we can help compare whether a one-way, open-jaw or multi-city structure makes the most sense.",
  },
  {
    id: "mixed-cabin",
    question: "Can I combine Economy and Business Class?",
    answer:
      "Mixed-cabin itineraries may be available depending on the airline, routing, ticketing structure and availability.",
  },
  {
    id: "exact-itinerary-needed",
    question: "Do I need to know my exact itinerary before contacting you?",
    answer:
      "No. You can share your destinations, approximate dates and what you're trying to achieve. We can help you explore the appropriate itinerary structure.",
  },
];

export default function OneWayFlightsPage() {
  return (
    <>
      <Header />
      <main id="top">
        <MultiCityHero
          headingLines={["One-Way & Open-Jaw Flights,", "Planned Around Your Journey"]}
          paragraphs={[
            "Not every international trip needs to start and end in the same city. Whether you're relocating, travelling through Europe, visiting family, planning an extended stay or combining several destinations, our travel specialists help you explore one-way and open-jaw flight options across North America, the UK and Europe.",
            "We compare suitable routes, airlines, airports, cabin options and fare structures around the way you actually want to travel.",
          ]}
          buttonLabel="Speak With a Travel Specialist"
          backgroundImage={unsplash("1502602898657-3e91760cbb34")}
        />

        <FeaturedBlockSection
          headingLines={["International Travel Doesn't Always", "Fit a Round Trip"]}
          body="A traditional return flight works well when you leave from one city and return to the same place. But your actual journey may look very different. In these situations, a one-way, open-jaw or multi-city itinerary may provide a more natural structure."
          images={[{ src: unsplash("1436491865332-7a61a109cc05"), alt: "An aircraft wing above the clouds during a sunset flight" }]}
          twoColumnItems={[
            [
              "Fly New York → London and return Paris → New York",
              "Travel Toronto → Rome and return Amsterdam → Toronto",
              "Fly one-way to Europe without fixing a return date",
              "Arrive in one country and leave from another",
            ],
            [
              "Travel between European cities by rail",
              "Fly Business Class in one or both directions",
              "Start from one North American city and return to another",
              "Visit several destinations without unnecessary backtracking",
            ],
          ]}
          imagePosition="left"
        />

        <FeaturedBlockSection
          headingLines={["What Is a One-Way", "International Flight?"]}
          body="A one-way flight takes you from your departure city to your destination without including a return sector on the same itinerary — New York → London, instead of New York → London → New York. A one-way itinerary can make sense when you are relocating, planning a long stay, travelling without a fixed return date or arranging the return journey separately."
          images={[{ src: unsplash("1569629743817-70d8db6c323b"), alt: "A wide-body aircraft on final approach against a blue sky" }]}
          twoColumnItems={[
            ["International relocation", "Students travelling abroad", "Long-term or extended travel", "European holidays", "Business assignments", "Family visits"],
            ["Cruise travel", "Digital nomad travel", "Flexible return plans", "Last-minute international travel", "Multi-country journeys"],
          ]}
          imagePosition="right"
        />

        <FeaturedBlockSection
          headingLines={["What Is an", "Open-Jaw Flight?"]}
          body="An open-jaw itinerary allows you to arrive in one city and return from another — New York → London, travel independently through London → Paris → Rome, then return Rome → New York. Instead of travelling back to London simply to catch your international flight home, your return flight leaves from Rome. This can make sense when your trip naturally moves between several destinations."
          images={[{ src: unsplash("1513635269975-59663e0ac1ad"), alt: "A European city skyline viewed from across a river" }]}
          imagePosition="left"
        />

        <ItineraryComparisonSection />

        <CenteredCtaBanner
          heading="Not Sure Which Structure You Need?"
          subheading="You don't need to know the answer before contacting us. Tell us where you're going, the cities you're considering and how you want the trip to unfold. Our specialists can help you explore which itinerary structure may fit your plans."
          buttonLabel="Compare My Itinerary Options"
        />

        <PlanningFactorsSection
          heading="Why Choose an Open-Jaw Itinerary?"
          subheading="An open-jaw flight can be useful when your journey doesn't naturally end where it began."
          items={[
            { id: "avoid-backtracking", label: "Avoid Unnecessary Backtracking", description: "If your trip ends in Rome, you may not want to return to London simply to catch your flight home. An open-jaw itinerary can allow your international flights to follow the direction of your journey." },
            { id: "see-more-europe", label: "See More of Europe", description: "Arriving in one city and departing from another can make it easier to include several destinations in one trip." },
            { id: "combine-rail", label: "Combine Flights With Rail Travel", description: "You can use international flights for the beginning and end of your journey — e.g. New York → London, then London → Paris → Amsterdam by rail, then Amsterdam → New York." },
            { id: "better-use-of-time", label: "Make Better Use of Your Time", description: "A well-structured itinerary can reduce unnecessary travel and leave more time for the places you actually want to visit." },
            { id: "build-around-plans", label: "Build Around Your Actual Plans", description: "Your flights should support your journey — not force you to reshape the trip around a conventional return ticket." },
          ]}
          columns={3}
        />

        <RouteFlowCompareSection />

        <PlanningFactorsSection
          heading="Popular One-Way & Open-Jaw Routes to Europe"
          subheading="These are examples of itinerary structures travellers may consider. Actual airline schedules, fares and availability depend on travel dates and routing."
          items={[
            { id: "nyc-london-paris", label: "New York → London | Paris → New York", description: "Arrive in London and travel through the UK or France before returning from Paris." },
            { id: "nyc-paris-rome", label: "New York → Paris | Rome → New York", description: "A natural structure for a France and Italy itinerary." },
            { id: "chicago-frankfurt-amsterdam", label: "Chicago → Frankfurt | Amsterdam → Chicago", description: "A potential option for journeys through Central and Northern Europe." },
            { id: "miami-madrid-lisbon", label: "Miami → Madrid | Lisbon → Miami", description: "A useful structure for travellers combining Spain and Portugal." },
            { id: "la-london-rome", label: "Los Angeles → London | Rome → Los Angeles", description: "Suitable for longer European journeys covering multiple regions." },
          ]}
          columns={3}
        />

        <PlanningFactorsSection
          heading="One-Way & Open-Jaw Travel From Canada"
          subheading=""
          items={[
            { id: "toronto-london-amsterdam", label: "Toronto → London | Amsterdam → Toronto", description: "Combine the UK with Northern Europe." },
            { id: "toronto-paris-rome", label: "Toronto → Paris | Rome → Toronto", description: "A natural structure for France and Italy travel." },
            { id: "montreal-frankfurt-london", label: "Montreal → Frankfurt | London → Montreal", description: "Combine Central Europe with the UK." },
            { id: "vancouver-paris-zurich", label: "Vancouver → Paris | Zurich → Vancouver", description: "A possible structure for a longer Western European itinerary." },
          ]}
          columns={4}
        />

        <WhyChooseSection
          heading="One-Way Travel for Different Types of Journeys"
          features={[
            { id: "relocating", title: "Relocating Internationally", description: "Moving to another country often doesn't fit a traditional return ticket. We help you explore options around your travel dates, baggage requirements, cabin preference, destination airport, fare flexibility and number of travellers." },
            { id: "student", title: "Student Travel", description: "Students beginning or completing international studies may need a one-way flight, flexible travel dates or additional baggage considerations." },
            { id: "business", title: "Business Travel", description: "Executives and professionals may travel internationally without knowing where their next assignment — or eventual return journey — will begin. A one-way itinerary can provide a more suitable starting point." },
            { id: "family", title: "Family Travel", description: "Long family visits, relocations and uncertain return dates can all make one-way travel worth considering." },
            { id: "cruise", title: "Cruise Travel", description: "Your cruise may begin in one city and finish in another, making an open-jaw flight structure particularly useful." },
            { id: "extended-europe", title: "Extended European Travel", description: "If you're planning to spend several weeks or months travelling across Europe, returning to your original arrival city may not make sense." },
          ]}
          variant="light"
          cardStyle="bordered"
          layout="grid"
        />

        <FeaturedBlockSection
          headingLines={["Business Class One-Way", "& Open-Jaw Travel"]}
          body="Premium travel doesn't have to mean a standard round trip. Depending on the route, airline, travel dates and availability, travellers may be able to explore Business Class or First Class options across one-way, open-jaw and multi-city journeys. For example: New York → London in Business Class, travel independently through Europe, then Rome → New York in Business Class — an open-jaw structure that lets your international flights follow your actual route."
          images={[{ src: unsplash("1587019158091-1a103c5dd17f"), alt: "Close-up detail of a first-class seat and personal suite" }]}
          twoColumnItems={[
            ["Business Class one-way", "Business Class outbound and return", "First Class on selected long-haul sectors", "Premium Economy combinations"],
            ["Mixed-cabin itineraries", "Multiple-airline combinations", "Alternative departure airports", "Flexible premium fares"],
          ]}
          buttonLabel="Compare Premium Cabin Options"
          buttonHref="#connect"
          imagePosition="right"
        />

        <PlanningFactorsSection
          heading="How We Plan the Right Open-Jaw Journey"
          subheading="An open-jaw itinerary involves more than choosing two different cities. We look at the journey as a whole."
          items={[
            { id: "arrival-city", label: "Arrival City", description: "Where does the European part of your trip make the most sense to begin?" },
            { id: "final-departure-city", label: "Final Departure City", description: "Where will your journey naturally finish?" },
            { id: "direction-of-travel", label: "Direction of Travel", description: "Does the itinerary move logically, or does it create unnecessary backtracking?" },
            { id: "ground-transportation", label: "Ground Transportation", description: "Would rail or other surface transportation make more sense between certain destinations?" },
            { id: "airline-networks", label: "Airline Networks", description: "Which airlines provide suitable options between your departure, arrival and return cities?" },
            { id: "airports", label: "Airports", description: "Could another gateway create a more practical itinerary?" },
            { id: "cabin-availability", label: "Cabin Availability", description: "Are Business Class, Premium Economy or First Class options available on the sectors that matter most?" },
            { id: "fare-conditions", label: "Fare Conditions", description: "How much flexibility do you need in your ticket?" },
            { id: "travel-dates", label: "Travel Dates", description: "Could shifting your departure or return by a day create additional possibilities?" },
          ]}
          columns={3}
        />

        <ComplexitySection
          heading="Flexible Fare Options for One-Way & Open-Jaw Travel"
          subheading="One-way and open-jaw journeys can involve different fare structures depending on the airline, route and travel dates. Fare conditions vary significantly between airlines and tickets — understanding the flexibility available before booking is important."
          listIntro="Depending on availability, you may be able to compare:"
          items={[
            ["Restricted fares", "Flexible fares", "Refundable fares where offered", "Business Class"],
            ["Premium Economy", "Mixed-cabin options", "Multiple-airline itineraries", "One-way fare structures"],
          ]}
          backgroundImage=""
          align="left"
        />

        <InfoBanner
          tone="cta"
          heading="Can You Use Different Airlines?"
          body="Your outbound and return flights don't always need to be on the same airline. Depending on the itinerary and ticketing structure, comparing different airlines may provide alternatives that better suit your route, timing or cabin preference."
          buttonLabel="Evaluate Airline Combinations"
        />

        <PlanningFactorsSection
          heading="When Does One-Way or Open-Jaw Travel Make Sense?"
          subheading=""
          items={[
            { id: "return-not-fixed", label: "Your Return Date Isn't Fixed", description: "You need to travel internationally but aren't ready to commit to a return date." },
            { id: "several-countries", label: "You're Visiting Several European Countries", description: "You want your international arrival and departure cities to follow the natural direction of your trip." },
            { id: "relocating-sense", label: "You're Relocating", description: "You only need to travel internationally in one direction." },
            { id: "studying-abroad", label: "You're Studying Abroad", description: "Your travel dates and return plans don't fit a standard holiday itinerary." },
            { id: "extended-trip", label: "You're Taking an Extended European Trip", description: "You want to explore several destinations without unnecessary backtracking." },
            { id: "travelling-business", label: "You're Travelling for Business", description: "Your journey begins and ends around different meetings, offices or cities." },
            { id: "taking-cruise", label: "You're Taking a Cruise", description: "Your cruise begins and ends in different ports." },
            { id: "rail-air", label: "You're Combining Rail & Air", description: "You want to fly across the Atlantic and travel between European destinations independently." },
          ]}
          columns={4}
        />

        <HowItWorksCarousel
          heading="A Simpler Way to Plan Complex International Travel"
          subheading="From Your Journey to a Confirmed Itinerary"
          steps={[
            { id: "tell-us", titleLines: "Tell Us About\nYour Journey", descriptionLines: "Share your departure city, destinations,\ndates and where you expect your trip to finish." },
            { id: "explore-structure", titleLines: "We Explore the Right\nItinerary Structure", descriptionLines: "We can compare one-way, open-jaw,\nmulti-city and conventional return options." },
            { id: "compare-airlines", titleLines: "Compare Airlines,\nRoutes & Cabins", descriptionLines: "Review suitable schedules, airports,\nairlines, cabin options and fare conditions." },
            { id: "refine-journey", titleLines: "Refine Your\nJourney", descriptionLines: "Adjust destinations, dates, routing\nor cabin preferences based on what works best." },
            { id: "confirm-itinerary", titleLines: "Confirm Your\nPreferred Itinerary", descriptionLines: "Once you've chosen your preferred option,\nproceed with the applicable booking." },
            { id: "post-booking", titleLines: "Get Post-Booking\nAssistance", descriptionLines: "Where applicable, our specialists remain\navailable for subsequent travel requirements." },
          ]}
        />

        <WhyChooseSection
          heading="Why Travellers Choose MultiCity Experts"
          features={[
            { id: "north-atlantic", title: "North Atlantic Specialists", description: "Focused on international travel between the USA, Canada, the UK and Europe." },
            { id: "one-way-expertise", title: "One-Way Travel Expertise", description: "Experience with international journeys that don't follow a traditional return structure." },
            { id: "open-jaw-planning", title: "Open-Jaw Planning", description: "Help structuring journeys that begin and end through different international gateways." },
            { id: "multi-city-knowledge", title: "Multi-City Knowledge", description: "Understand how several destinations and flight sectors can work together." },
            { id: "business-class-expertise", title: "Business Class Expertise", description: "Guidance for premium-cabin travel across one-way, open-jaw and multi-city journeys." },
            { id: "airline-comparison", title: "Airline Comparison Guidance", description: "Compare suitable carriers based on route, schedule, cabin and travel preferences." },
            { id: "flexible-fare-guidance", title: "Flexible Fare Guidance", description: "Understand relevant fare conditions before confirming your itinerary." },
            { id: "human-consultants", title: "Human Travel Consultants", description: "Discuss complicated international travel plans with experienced specialists." },
            { id: "post-booking-support", title: "Post-Booking Support", description: "Where applicable, assistance can continue when your travel plans later change." },
          ]}
          variant="dark"
          cardStyle="bordered"
          layout="grid"
        />

        <ChecklistSection />

        <OneWayFlightsRequestForm />

        <LightFaqSection heading="Frequently Asked Questions" faqs={FAQS} />

        <FinalCTA
          heading="Your International Journey Doesn't Have to Be a Round Trip"
          body="Fly into one city. Travel through Europe. Return from another. Or travel one-way and build the rest of your journey around your own plans. Tell us where you want to go, and our travel specialists can help you compare suitable one-way, open-jaw and multi-city options."
          buttonLabel="Plan My One-Way or Open-Jaw Journey"
          buttonHref="#connect"
          buttonVariant="gold"
        />
      </main>
      <Footer />
    </>
  );
}
