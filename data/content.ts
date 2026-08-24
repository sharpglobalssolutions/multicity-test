import { Armchair, Headset, Route, ShieldCheck, Users } from "lucide-react";
import { unsplash } from "@/lib/images";
import heroImage from "@/public/images/landing-img.webp"

export const NAV_LINKS = [
  { label: "", href: "#flights" },
  { label: "Business Class", href: "#business-class" },
  { label: "First Class", href: "#services" },
  { label: "Destinations", href: "#destinations" },
  { label: "Travel Insights", href: "#insights" },
  { label: "About Us", href: "#faq" },
] as const;

export const PARTNER_AIRLINES = [
  "American Airlines",
  "British Airways",
  "Emirates",
  "Qatar Airways",
  "Lufthansa",
  "Singapore Airlines",
  "Cathay Pacific",
] as const;

export interface Deal {
  id: string;
  city: string;
  route: string;
  price: string;
  image: string;
  alt: string;
}

export const DEALS: Deal[] = [
  {
    id: "paris",
    city: "Paris",
    route: "New York → Paris",
    price: "$2,499",
    image: unsplash("1502602898657-3e91760cbb34"),
    alt: "The Eiffel Tower rising above the rooftops of Paris at dusk",
  },
  {
    id: "london",
    city: "London",
    route: "Boston → London",
    price: "$2,199",
    image: unsplash("1513635269975-59663e0ac1ad"),
    alt: "The Elizabeth Tower and Houses of Parliament in London",
  },
  {
    id: "dubai",
    city: "Dubai",
    route: "Los Angeles → Dubai",
    price: "$3,299",
    image: unsplash("1512453979798-5ea266f8880c"),
    alt: "The Dubai skyline with the Burj Khalifa at sunset",
  },
  {
    id: "singapore",
    city: "Singapore",
    route: "San Francisco → Singapore",
    price: "$3,899",
    image: unsplash("1525625293386-3f8f99389edd"),
    alt: "Marina Bay Sands and the Singapore skyline at night",
  },
  {
    id: "tokyo",
    city: "Tokyo",
    route: "Chicago → Tokyo",
    price: "$3,099",
    image: unsplash("1540959733332-eab4deabeeaf"),
    alt: "The Tokyo skyline glowing at twilight",
  },
  {
    id: "new-york",
    city: "New York",
    route: "London → New York",
    price: "$1,999",
    image: unsplash("1496442226666-8d4d0e62e6e9"),
    alt: "The Manhattan skyline viewed across the water at golden hour",
  },
  {
    id: "hong-kong",
    city: "Hong Kong",
    route: "Los Angeles → Hong Kong",
    price: "$3,599",
    image: unsplash("1533929736458-ca588d08c8be"),
    alt: "The Hong Kong skyline and harbor at dusk",
  },
  {
    id: "sydney",
    city: "Sydney",
    route: "San Francisco → Sydney",
    price: "$3,799",
    image: unsplash("1552832230-c0197dd311b5"),
    alt: "Sydney Harbour with the Opera House at sunset",
  },
];

export interface ServiceCard {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
}

export const SERVICES: ServiceCard[] = [
  {
    id: "Business Class Flights",
    category: "Business Class",
    title: "Business Class Flights",
    description: "Explore Business Class options for long-haul and international journeys, with consideration for your preferredroutes, airlines, schedules and travel requirements.",
    image: unsplash("1544620347-c4fd4a3d5957"),
    alt: "A lie-flat business class seat in a dimly lit cabin",
    href: "#business-class",
  },
  {
    id: "first-class",
    category: "First Class Flights",
    title: "First Class Flights",
    description: "Explore available First Class options when greater privacy, space and a premium onboard experience are important to your journey.",
    image: unsplash("1587019158091-1a103c5dd17f"),
    alt: "Close-up detail of a first-class seat and personal suite",
    href: "#services",
  },
  {
    id: "global-deals",
    category: "Flight Deals",
    title: "International Flights",
    description: "Plan international journeys across North America, the UK, Europe and other major destinations with personalised travel guidance.",
    image: unsplash("1474302770737-173ee21bab63"),
    alt: "A commercial aircraft climbing into a golden evening sky",
    href: "#destinations",
  },
  {
    id: "group-travel",
    category: "Group Travel",
    title: "Corporate Travel",
    description: "From executive travel to frequent business journeys, we help companies and professionals plan international itineraries around schedules, premium cabin preferences and flexible travel requirements.",
    image: unsplash("1543269865-cbf427effbad"),
    alt: "A group of friends smiling together while planning a trip",
    href: "#connect",
  },
  {
    id: "corporate-travel",
    category: "Corporate Travel",
    title: "Premium Economy",
    description: "Looking for more space and comfort without moving all the way to Business Class? Explore Premium Economy options suited to your journey and priorities.",
    image: unsplash("1600880292203-757bb62b4baf"),
    alt: "Two business travelers celebrating a successful meeting",
    href: "#connect",
  },
  {
    id: "leisure-travel",
    category: "Leisure Travel",
    title: "Flight Changes & Travel Assistance",
    description: "Already booked and need help? We can assist with eligible travel requirements including flight changes,rebooking, schedule changes, missed flights and other post-booking needs.",
    image: unsplash("1476514525535-07fb3b4ae5f1"),
    alt: "A wooden boat crossing a turquoise alpine lake surrounded by mountains",
    href: "#connect",
  },
];

export interface ExpertFeature {
  id: string;
  icon: typeof Users;
  title: string;
  description: string;
}

export const EXPERT_FEATURES: ExpertFeature[] = [
  {
    id: "expert-assistance",
    icon: Headset,
    title: "International Travel Specialists",
    description: "Our specialists understand the practical considerations behind international flight planning from airlines and routes to fare structures, cabin classes and connections.",
  },
  {
    id: "complex-itineraries",
    icon: Route,
    title: "Personalised Travel Guidance",
    description: "There is no single “best” itinerary for everyone. We consider your destination, schedule, comfort preferences,flexibility requirements and budget when evaluating available options.",
  },
  {
    id: "premium-cabin-access",
    icon: Armchair,
    title: "Business & Premium Cabin Expertise",
    description: "Our expertise includes Business Class, First Class and Premium Economy travel across major international routes.",
  },
  {
    id: "competitive-fares",
    icon: ShieldCheck,
    title: "Complex Itinerary Specialists",
    description: "Multi-city journeys, multiple destinations, connecting flights and less conventional routing can require more thought than a standard round trip. That's where specialist planning can add real value.",
  },
  {
    id: "support",
    icon: Users,
    title: "Human Travel Support",
    description: "When you need assistance, you can speak with a real travel specialist rather than relying entirely on a self-service booking system.",
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "MultiCityExperts found us a business class routing to Singapore that our usual agent said didn't exist. Seamless from quote to boarding.",
    name: "David Whitfield",
    location: "New York → Singapore",
    rating: 5,
    avatar: unsplash("1507003211169-0a1dd7228f2d"),
  },
  {
    id: "t2",
    quote:
      "The multi-city itinerary they built for our board's Europe trip saved us two full connections and still came in under budget.",
    name: "Priya Nair",
    location: "Chicago → London → Zurich",
    rating: 5,
    avatar: unsplash("1494790108377-be9c29b29330"),
  },
  {
    id: "t3",
    quote: "First class to Tokyo for less than I expected to pay for economy. I won't book international travel any other way now.",
    name: "Marcus Alden",
    location: "San Francisco → Tokyo",
    rating: 5,
    avatar: unsplash("1500648767791-00dcc994a43e"),
  },
  {
    id: "t4",
    quote: "Responsive, precise, and genuinely helpful when our return flight was cancelled. They had us rebooked before the airline even called.",
    name: "Elena Marchetti",
    location: "Los Angeles → Dubai",
    rating: 5,
    avatar: unsplash("1534528741775-53994a69daeb"),
  },
  {
    id: "t5",
    quote: "I've used them for three multi-city trips now. Every itinerary has come back tighter and cheaper than what I could put together myself.",
    name: "James Okafor",
    location: "New York → Hong Kong → Sydney",
    rating: 5,
    avatar: unsplash("1544005313-94ddf0286df2"),
  },
];

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    id: "faq-1",
    question: "How does your business class flight service work?",
    answer:
      "Tell us your route and travel dates and one of our advisors sources premium fares across our full airline network, then sends you a curated shortlist with clear pricing — no obligation to book.",
  },
  {
    id: "faq-2",
    question: "Can you help with complex international itineraries?",
    answer:
      "Yes — multi-city routings, mixed cabins, and stopovers are where we do our best work. We plan the full itinerary around your schedule, not just a single leg.",
  },
  {
    id: "faq-3",
    question: "How do I request a flight quote?",
    answer:
      "Use the flight search above or the \"Get a Quote\" button in the header. An advisor typically responds with options within one business day.",
  },
  {
    id: "faq-4",
    question: "Do you offer first-class flights?",
    answer:
      "We do, on the routes and airlines where first class is available. Let us know if it's a priority and we'll prioritize those options in your quote.",
  },
  {
    id: "faq-5",
    question: "Can you help with multi-city travel?",
    answer:
      "Multi-city is a core part of what we do — from a simple open-jaw to a full round-the-world itinerary across multiple cabins and carriers.",
  },
];

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const STATS: Stat[] = [
  { id: "partners", value: 200, suffix: "+", label: "Airline Partners" },
  { id: "satisfaction", value: 95, suffix: "%", label: "Customer Satisfaction" },
  { id: "experience", value: 20, suffix: "+", label: "Years Experience" },
];

/** Single source of truth for the site's social profile links — used by
 * both the footer and the homepage "Let's Stay Connected" section. No
 * real profile URLs have been configured yet, so these are placeholders;
 * update the `href` values here once real accounts exist and every
 * consumer picks it up automatically. */
export const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "YouTube", href: "#", icon: "youtube" },
] as const;

/** Payment/trust badges shown in the footer. No official brand logo
 * assets exist in the project yet, so these render as plain grayscale
 * wordmarks rather than fabricated logo graphics — swap in real SVGs
 * under `public/images/payments/` and reference them here once available. */
export const TRUST_BADGES = ["Visa", "Mastercard", "American Express", "Norton", "Discover", "Diners Club"] as const;

export const HERO_IMAGE = {
  src: heroImage,
  alt: "A warmly lit premium business class airplane cabin with lie-flat seating",
};

export const BUSINESS_CLASS_IMAGES = [
  {
    src: unsplash("1569154941061-e231b4725ef1"),
    alt: "A passenger's premium business class seat and workspace in flight",
  },
  {
    src: unsplash("1569629743817-70d8db6c323b"),
    alt: "A wide-body aircraft on final approach against a blue sky",
  },
  {
    src: unsplash("1500835556837-99ac94a94552"),
    alt: "View from an aircraft window over clouds lit by a golden sunset",
  },
  {
    src: unsplash("1488085061387-422e29b40080"),
    alt: "An aircraft window view of a city skyline during descent at sunset",
  },
];

export const PERSONALIZED_JOURNEY_IMAGES = [
  {
    src: unsplash("1544198365-f5d60b6d8190"),
    alt: "A luxurious first class aircraft seat and suite",
  },
  {
    src: unsplash("1524661135-423995f22d0b"),
    alt: "A pinned world map showing routes across countries and continents",
  },
  {
    src: unsplash("1488646953014-85cb44e25828"),
    alt: "A map, camera, and travel backpack laid out while planning a trip",
  },
];

export const EXPERTS_BACKGROUND_IMAGE = {
  src: "/images/plan-img.webp",
  alt: "A commercial aircraft taking off head-on at sunset",
};

