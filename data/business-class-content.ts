import {
  Armchair,
  CalendarClock,
  Plane,
  RefreshCw,
  Route,
  ScrollText,
} from "lucide-react";
import { BUSINESS_CLASS_IMAGES, DEALS, EXPERTS_BACKGROUND_IMAGE, ROUTE_DEALS, type Faq, type Stat } from "@/data/content";

export const HERO_BACKGROUND_IMAGE = EXPERTS_BACKGROUND_IMAGE;

/** Feeds the shared `Statistics` component (homepage's own stats bar) —
 * reused here instead of a page-specific stats component, per the
 * "don't duplicate what already exists" pattern this page follows for
 * `FinalCTA`/`TestimonialCarousel`/`FAQ` too. "One-Way"/"Multi-City" aren't
 * numbers, so they use `displayValue` instead of animating; `value`/
 * `suffix` are still required by the shared type but unused when set. */
export const BUSINESS_CLASS_STATS: Stat[] = [
  { id: "years-experience", value: 11, suffix: "+", label: "Years Experience" },
  { id: "international-routes", value: 200, suffix: "+", label: "International Routes" },
  { id: "one-way", value: 0, suffix: "", label: "Expertise", displayValue: "One-Way" },
  { id: "multi-city", value: 0, suffix: "", label: "Expertise", displayValue: "Multi-City" },
];

/** First 6 of the existing `DEALS` catalog — same data the homepage's
 * `DestinationCarousel` reads from, just presented as a static grid of
 * green-CTA cards here instead of a carousel (per this page's own design
 * spec) rather than a duplicate dataset. */
export const QUICK_CONSULT_DEALS = DEALS.slice(0, 6);

export const ONE_WAY_BLOCK = {
  eyebrowLines: ["ONE-WAY", "BUSINESS CLASS"],
  body: "Not every trip needs a return date. Whether you're relocating, extending a journey, or simply booking each leg on its own terms, one-way Business Class gives you the flexibility to structure travel exactly the way you need it — without paying for a round trip you won't use.",
  buttonLabel: "Explore One-Way",
  buttonHref: "#connect",
  image: BUSINESS_CLASS_IMAGES[1]!,
};

export const MULTI_CITY_BLOCK = {
  eyebrowLines: ["MULTI-CITY", "BUSINESS CLASS"],
  body: "Visiting more than one destination on the same trip shouldn't mean booking separate, disconnected fares. Our specialists build multi-city Business Class itineraries around your full route — coordinating connections, cabins and timing so every leg works together.",
  buttonLabel: "Explore Multi-City",
  buttonHref: "#connect",
  image: BUSINESS_CLASS_IMAGES[2]!,
};

export interface FareComplexityItem {
  id: string;
  label: string;
  icon: typeof Route;
}

export const FARE_COMPLEXITY_ITEMS: FareComplexityItem[] = [
  { id: "routing", label: "Routing", icon: Route },
  { id: "cabin-class", label: "Cabin Class", icon: Armchair },
  { id: "fare-rules", label: "Fare Rules", icon: ScrollText },
  { id: "availability", label: "Availability", icon: CalendarClock },
  { id: "airlines", label: "Airlines", icon: Plane },
  { id: "flexibility", label: "Flexibility", icon: RefreshCw },
];

export const BEYOND_PRICE_BENEFITS = [
  "Flexible fares",
  "Better routing",
  "Premium cabins",
  "Airline options",
  "Change flexibility",
  "Travel support",
];

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  { number: "01", title: "Tell Us", description: "Share your travel requirements." },
  { number: "02", title: "We Find Options", description: "Our specialists evaluate suitable routes and fares." },
  { number: "03", title: "Choose & Book", description: "Select the option that works best for you." },
];

export const JOURNEY_BLOCK = {
  headingLines: ["Business Class is not", "about a single flight.", "It's about the journey."],
  body: "A great Business Class experience is built from more than one good fare. Routing, connection times, cabin type, and how much flexibility you have if plans change all shape how the journey actually feels — not just the price on the fare screen.",
  benefits: ["Routing built around you", "Realistic connection times", "Cabin experience that matches the journey", "Flexibility when plans shift"],
  buttonLabel: "Explore Business Class",
  buttonHref: "#connect",
  image: BUSINESS_CLASS_IMAGES[0]!,
};

export interface BusinessClassServiceItem {
  title: string;
  description: string;
}

export const BUSINESS_CLASS_SERVICES: BusinessClassServiceItem[] = [
  {
    title: "One-Way Business Class",
    description: "Book a single leg on its own terms, without the constraints of a round-trip fare.",
  },
  {
    title: "Multi-City Business Class",
    description: "Coordinated itineraries across multiple destinations, planned as one connected journey.",
  },
  {
    title: "Business Class Upgrades",
    description: "Evaluating upgrade paths and fare structures that make premium cabins more attainable.",
  },
  {
    title: "Flight Changes & Rebooking",
    description: "Support when plans shift — re-routing, rebooking and fare adjustments handled for you.",
  },
  {
    title: "Premium Cabin Options",
    description: "Comparing Business, Premium Economy and First Class across airlines for the best fit.",
  },
  {
    title: "Travel Support",
    description: "A specialist you can reach before, during and after booking — not just at checkout.",
  },
];

export const EXPERTISE_DESTINATION_IMAGES = DEALS.slice(0, 3);

/** The existing `ROUTE_DEALS` catalog (already used by `RoutesCarousel`),
 * reduced to just the origin/destination pair this list needs — real
 * backend-sourced routes, not a hardcoded illustrative list. */
export const POPULAR_ROUTES = ROUTE_DEALS.map((route) => ({
  id: route.id,
  originCity: route.originCity,
  destinationCity: route.destinationCity,
}));

export const BUSINESS_CLASS_FAQS: Faq[] = [
  {
    id: "fare-included",
    question: "What is included in a business-class fare?",
    answer:
      "It varies by airline and fare type — typically lie-flat or angled seating, checked baggage, lounge access, and priority boarding, alongside enhanced dining. We'll walk you through exactly what's included before you book.",
  },
  {
    id: "change-booking",
    question: "Can I change my business-class booking?",
    answer:
      "Often yes, depending on the fare rules attached to your ticket. Some fares allow free changes, others carry a fee — we check this upfront so there are no surprises later.",
  },
  {
    id: "multi-city",
    question: "Do you offer multi-city business-class routes?",
    answer:
      "Yes — multi-city Business Class is one of our specialties. We plan connected itineraries across multiple destinations rather than booking each leg in isolation.",
  },
  {
    id: "flexible-fares",
    question: "Can you help find flexible business-class fares?",
    answer:
      "Absolutely. If flexibility matters more than the lowest headline price, we'll prioritise fares that let you change dates or routing without heavy penalties.",
  },
  {
    id: "how-it-works",
    question: "How does your business-class booking service work?",
    answer:
      "Tell us your travel requirements, our specialists evaluate suitable routes and fares across airlines, and you choose the option that works best for you — with support throughout.",
  },
];
