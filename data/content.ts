import { Armchair, Headset, Route, ShieldCheck, Users } from "lucide-react";
import { unsplash } from "@/lib/images";

export const NAV_LINKS = [
  { label: "Flights", href: "#flights" },
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
    price: "From $2,499",
    image: unsplash("1502602898657-3e91760cbb34"),
    alt: "The Eiffel Tower rising above the rooftops of Paris at dusk",
  },
  {
    id: "london",
    city: "London",
    route: "Boston → London",
    price: "From $2,199",
    image: unsplash("1513635269975-59663e0ac1ad"),
    alt: "The Elizabeth Tower and Houses of Parliament in London",
  },
  {
    id: "dubai",
    city: "Dubai",
    route: "Los Angeles → Dubai",
    price: "From $3,299",
    image: unsplash("1512453979798-5ea266f8880c"),
    alt: "The Dubai skyline with the Burj Khalifa at sunset",
  },
  {
    id: "singapore",
    city: "Singapore",
    route: "San Francisco → Singapore",
    price: "From $3,899",
    image: unsplash("1525625293386-3f8f99389edd"),
    alt: "Marina Bay Sands and the Singapore skyline at night",
  },
  {
    id: "tokyo",
    city: "Tokyo",
    route: "Chicago → Tokyo",
    price: "From $3,099",
    image: unsplash("1540959733332-eab4deabeeaf"),
    alt: "The Tokyo skyline glowing at twilight",
  },
  {
    id: "new-york",
    city: "New York",
    route: "London → New York",
    price: "From $1,999",
    image: unsplash("1496442226666-8d4d0e62e6e9"),
    alt: "The Manhattan skyline viewed across the water at golden hour",
  },
  {
    id: "hong-kong",
    city: "Hong Kong",
    route: "Los Angeles → Hong Kong",
    price: "From $3,599",
    image: unsplash("1533929736458-ca588d08c8be"),
    alt: "The Hong Kong skyline and harbor at dusk",
  },
  {
    id: "sydney",
    city: "Sydney",
    route: "San Francisco → Sydney",
    price: "From $3,799",
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
    id: "business-class",
    category: "Business Class",
    title: "Business Class Flights",
    description: "Find premium business class options for international travel.",
    image: unsplash("1544620347-c4fd4a3d5957"),
    alt: "A lie-flat business class seat in a dimly lit cabin",
    href: "#business-class",
  },
  {
    id: "first-class",
    category: "First Class",
    title: "First Class Flights",
    description: "Travel in complete comfort with premium first-class experiences.",
    image: unsplash("1587019158091-1a103c5dd17f"),
    alt: "Close-up detail of a first-class seat and personal suite",
    href: "#services",
  },
  {
    id: "global-deals",
    category: "Flight Deals",
    title: "Global Flight Deals",
    description: "Discover competitive fares across major international routes.",
    image: unsplash("1474302770737-173ee21bab63"),
    alt: "A commercial aircraft climbing into a golden evening sky",
    href: "#destinations",
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
    title: "Expert Assistance",
    description: "Dedicated advisors who understand premium international travel end to end.",
  },
  {
    id: "complex-itineraries",
    icon: Route,
    title: "Complex Itineraries",
    description: "Multi-city and stopover routings planned around how you actually want to travel.",
  },
  {
    id: "premium-cabin-access",
    icon: Armchair,
    title: "Premium Cabin Access",
    description: "Business and first class inventory across the airlines that matter most to you.",
  },
  {
    id: "competitive-fares",
    icon: ShieldCheck,
    title: "Competitive Fares",
    description: "Premium travel at fares that make sense, sourced across our full airline network.",
  },
  {
    id: "support",
    icon: Users,
    title: "24/7 Support",
    description: "Real support around the clock, before departure and while you're on the road.",
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

export interface InsightArticle {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
}

export const INSIGHTS: InsightArticle[] = [
  {
    id: "insight-1",
    category: "Business Travel",
    title: "How to Book Business Class for Less Than You Think",
    description: "The fare structures, timing, and routings that consistently uncover premium value on long-haul routes.",
    image: unsplash("1502920514313-52581002a659"),
    alt: "A quiet premium airport lounge with floor-to-ceiling windows",
    href: "#",
  },
  {
    id: "insight-2",
    category: "Itinerary Planning",
    title: "Planning a Multi-City Trip Without the Headache",
    description: "A practical framework for sequencing stopovers so your itinerary works with you, not against you.",
    image: unsplash("1470004914212-05527e49370b"),
    alt: "View of clouds from an aircraft window at cruising altitude",
    href: "#",
  },
  {
    id: "insight-3",
    category: "Travel Tips",
    title: "What Actually Changes Between First and Business Class",
    description: "A clear-eyed comparison of cabin, service, and fare differences to help you decide where to spend.",
    image: unsplash("1436491865332-7a61a109cc05"),
    alt: "An aircraft wing above the clouds during a sunset flight",
    href: "#",
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

export const FOOTER_LINKS = {
  services: [
    { label: "Business Class", href: "#business-class" },
    { label: "First Class", href: "#services" },
    { label: "Flight Deals", href: "#destinations" },
    { label: "Group Travel", href: "#" },
    { label: "Multi-City Travel", href: "#flights" },
  ],
  company: [
    { label: "About", href: "#faq" },
    { label: "Contact", href: "#connect" },
    { label: "Travel Experts", href: "#experts" },
    { label: "Reviews", href: "#testimonials" },
    { label: "Blog", href: "#insights" },
  ],
  support: [
    { label: "FAQs", href: "#faq" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact Support", href: "#connect" },
  ],
  destinations: [
    { label: "Europe", href: "#destinations" },
    { label: "Asia", href: "#destinations" },
    { label: "Middle East", href: "#destinations" },
    { label: "North America", href: "#destinations" },
    { label: "South America", href: "#destinations" },
  ],
} as const;

export const HERO_IMAGE = {
  src: unsplash("1540339832862-474599807836"),
  alt: "A warmly lit premium business class airplane cabin with lie-flat seating",
};

export const BUSINESS_CLASS_IMAGE = {
  src: unsplash("1569154941061-e231b4725ef1"),
  alt: "A passenger's premium business class seat and workspace in flight",
};

export const PERSONALIZED_JOURNEY_IMAGE = {
  src: unsplash("1544198365-f5d60b6d8190"),
  alt: "A luxurious first class aircraft seat and suite",
};

export const EXPERTS_BACKGROUND_IMAGE = {
  src: unsplash("1526772662000-3f88f10405ff"),
  alt: "The interior of a premium wide-body aircraft cabin",
};

export const FINAL_CTA_IMAGE = {
  src: unsplash("1517400508447-f8dd518b86db"),
  alt: "A relaxed passenger enjoying a premium aircraft cabin",
};
