import { unsplash } from "@/lib/images";
import type { HowItWorksStep } from "@/components/multi-city/HowItWorksCarousel";

export interface WhyChooseValue {
  id: string;
  title: string;
  description: string;
}

export const WHY_CHOOSE_VALUES: WhyChooseValue[] = [
  {
    id: "advice-tailored",
    title: "Advice Tailored to You",
    description:
      "We understand your plans, priorities and preferences before recommending the right travel options.",
  },
  {
    id: "international-expertise",
    title: "International Travel Expertise",
    description:
      "With 11+ years of experience, we understand international flights, airline fares and complex itineraries.",
  },
  {
    id: "value-not-fare",
    title: "Value, Not Just the Lowest Fare",
    description:
      "We look beyond price to consider comfort, flexibility, schedules, routing and overall value.",
  },
  {
    id: "complex-journeys",
    title: "Expertise for Complex Journeys",
    description:
      "From Business Class and multi-city travel to unexpected disruptions, we help simplify complicated journeys.",
  },
  {
    id: "real-people",
    title: "Real People, Real Travel Advice",
    description:
      "Speak directly with experienced travel specialists who understand your journey—not just an automated booking system.",
  },
  {
    id: "traveller-first",
    title: "A Traveller-First Approach",
    description:
      "Every recommendation starts with one question: what's right for you?",
  },
];

export const ONE_SIZE_BODY =
  "<p>Every traveller has different priorities. A business traveller may value arrival time, while a family may prefer shorter connections. A retired couple may prioritise comfort, while a student may need flexibility.</p><p>That's why we don't offer one-size-fits-all travel advice. We tailor our international travel recommendations to what matters most to you.</p>";

export const BEYOND_FARE_IMAGE = {
  src: unsplash("1512453979798-5ea266f8880c"),
  alt: "Traveller reviewing international flight options",
};

export const BEYOND_FARE_INTRO =
  "The lowest fare isn't always the best fit. When reviewing international flight options, we consider:";

export const BEYOND_FARE_ITEMS: string[] = [
  "Travel dates & schedules",
  "Connection times",
  "Departure & arrival airports",
  "Cabin preferences",
  "Fare flexibility",
  "One-way or return options",
  "Multi-city routing",
  "Total travel time",
  "Business Class availability",
  "Overall journey convenience",
];

export const EXPERIENCE_IMAGE = {
  src: unsplash("1544620347-c4fd4a3d5957"),
  alt: "Travel specialist planning an international itinerary",
};

export const EXPERIENCE_BODY =
  "<p>Our 11+ years of travel experience help us navigate airline rules, routing options and complex international travel planning.</p><p>But travel is personal. Whether you're travelling for work, family, education or a special occasion, we combine expertise with empathy to recommend options that genuinely fit your journey.</p>";

export const EXPERTISE_IMAGE = {
  src: unsplash("1540959733332-eab4deabeeaf"),
  alt: "Business class cabin for complex international travel",
};

export const EXPERTISE_INTRO =
  "We help simplify journeys that require more than a standard flight search, including:";

export const EXPERTISE_ITEMS: string[] = [
  "Business Class travel",
  "Multi-city itineraries",
  "North Atlantic routes",
  "One-way international flights",
  "Last-minute travel",
  "Flight changes & disruptions",
  "Premium travel planning",
  "Complex international routing",
];

export const CONSULTATION_STEPS: HowItWorksStep[] = [
  {
    id: "contact-us",
    titleLines: "Contact Us",
    descriptionLines: "Reach out to a travel specialist.",
  },
  {
    id: "understand-plans",
    titleLines: "Understand Your\nPlans",
    descriptionLines: "We learn your priorities and travel needs.",
  },
  {
    id: "explore-options",
    titleLines: "Explore Suitable\nOptions",
    descriptionLines: "We review routes, fares and flight options.",
  },
  {
    id: "receive-advice",
    titleLines: "Receive Personalised\nAdvice",
    descriptionLines: "Get recommendations tailored to your journey.",
  },
  {
    id: "travel-confidence",
    titleLines: "Travel With\nConfidence",
    descriptionLines: "Book and travel knowing it's the right fit.",
  },
];

export const CONSULTATION_SUBHEADING =
  "From understanding your itinerary to reviewing international flight options, our travel specialists guide you through each step with advice tailored to your journey.";

export const CONSULTATION_LINK_HTML =
  '<a href="/contact" class="font-semibold text-navy-deep hover:text-emerald hover:underline">Explore How Our Travel Consultation Works &rarr;</a>';

export const WHY_EXPERIENCE_MATTERS_BODY =
  "<p>International travel involves more than finding a flight. Fare rules, transit requirements, connection times, airport choices, cabin options and schedule flexibility can all affect your journey.</p><p>Our experience helps you understand these details, compare your options and make more informed travel decisions.</p>";

export const OUR_COMMITMENT_BODY =
  "<p>We listen before we recommend, explain your options clearly and focus on overall value—not just price.</p><p>With honest communication and thoughtful guidance, we aim to make complex international travel easier to understand and plan.</p>";
