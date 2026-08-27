import { unsplash } from "@/lib/images";
import { BUSINESS_CLASS_IMAGES, PERSONALIZED_JOURNEY_IMAGES, SUPPORT_SPECIALIST_IMAGE } from "@/data/content";

export const STORY_IMAGES = {
  large: {
    src: unsplash("1590086782792-42dd2350140d"),
    alt: "Portrait of a MultiCityExperts travel specialist",
  },
  overlap: {
    src: unsplash("1608649672519-e8797a9560cf"),
    alt: "Portrait of a senior MultiCityExperts travel specialist",
  },
  female: {
    src: unsplash("1580489944761-15a19d654956"),
    alt: "Portrait of a MultiCityExperts travel specialist",
  },
};

export const STORY_PARAGRAPHS = [
  "MultiCityExperts started with a simple observation: the more complex a journey becomes, the harder it is to book well. Multi-city routings, mixed cabins, and international connections rarely fit neatly into a standard search box.",
  "Over more than a decade, we've built our approach around real conversations with real travellers — understanding not just where someone needs to go, but how they want to get there.",
  "Today, we work with travellers who want more than a fare — they want a plan built around their priorities, backed by people who actually understand international travel.",
];

export const APPROACH_IMAGE = PERSONALIZED_JOURNEY_IMAGES[2]!;

export const APPROACH_TEXT =
  "We don't just search for the cheapest fare. We look at the full picture — routing, cabin, timing and flexibility — to build a plan that actually works for your journey.";

export const APPROACH_DIFFERENTIATORS = [
  "Personalised guidance",
  "Flexible travel options",
  "Experienced specialists",
  "Dedicated assistance",
];

export interface WhoWeHelpCard {
  id: string;
  title: string;
  image: string;
  alt: string;
}

export const WHO_WE_HELP_CARDS: WhoWeHelpCard[] = [
  {
    id: "business-travellers",
    title: "Business Travellers",
    image: unsplash("1530521954074-e64f6810b32d"),
    alt: "A business traveller relaxing at the gate as an aircraft departs",
  },
  {
    id: "families",
    title: "Families",
    image: unsplash("1760654339407-970cede10f46"),
    alt: "A father and daughter looking out over the tarmac at the airport",
  },
  {
    id: "couples",
    title: "Couples",
    image: unsplash("1687992176093-6417a93fa3d0"),
    alt: "A couple walking together through an airport terminal",
  },
];

export const HOW_WE_HELP_IMAGE = SUPPORT_SPECIALIST_IMAGE;

export interface CoreValue {
  id: string;
  title: string;
  description: string;
}

export const CORE_VALUES: CoreValue[] = [
  {
    id: "expertise",
    title: "Expertise",
    description:
      "Our specialists bring years of hands-on experience navigating complex international itineraries, airlines and fare structures.",
  },
  {
    id: "empathy",
    title: "Empathy",
    description: "We take the time to understand each traveller's priorities, constraints and the reason behind every trip.",
  },
  {
    id: "transparency",
    title: "Transparency",
    description:
      "Clear pricing and honest guidance — we tell you what actually matters for your journey, not just what's easiest to sell.",
  },
  {
    id: "personalisation",
    title: "Personalisation",
    description: "Every itinerary is shaped around your schedule, comfort preferences and the way you actually like to travel.",
  },
  {
    id: "long-term-relationships",
    title: "Long-Term Relationships",
    description: "We aim to be the specialist you call for every trip — not just a one-time booking service.",
  },
  {
    id: "reliability",
    title: "Reliability",
    description: "From the first enquiry to the final leg of your journey, you can count on us to follow through.",
  },
];

export const WHY_CHOOSE_IMAGE = BUSINESS_CLASS_IMAGES[0]!;

export const WHY_CHOOSE_ITEMS = [
  "Expert guidance",
  "Personalised travel options",
  "Complex routing support",
  "Experienced specialists",
  "Flexible solutions",
  "Dedicated assistance",
  "Multi-city expertise",
  "International travel support",
];

export const ABOUT_FAQS = [
  {
    id: "about-faq-1",
    question: "What makes MultiCityExperts different from a standard travel site?",
    answer:
      "We focus specifically on complex international itineraries — multi-city routing, premium cabins, and journeys that don't fit a simple search box. Every plan is built by a specialist, not just an algorithm.",
  },
  {
    id: "about-faq-2",
    question: "Do you only work with business class travellers?",
    answer:
      "Not at all. We work with business travellers, families and couples across Economy through First Class — the common thread is journeys with more than one destination or moving part.",
  },
  {
    id: "about-faq-3",
    question: "How quickly can I get a response from a specialist?",
    answer: "Most enquiries receive a response within one business day, often sooner.",
  },
  {
    id: "about-faq-4",
    question: "Is there a fee to speak with a travel specialist?",
    answer: "No — an initial conversation about your itinerary is free. You only pay for the flights and services you choose to book.",
  },
  {
    id: "about-faq-5",
    question: "Can you help if my plans change after booking?",
    answer:
      "Yes. We provide ongoing support for flight changes, rebooking and unexpected disruptions for the itineraries we help arrange.",
  },
];
