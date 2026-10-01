import { SectionReveal } from "@/components/SectionReveal";

export interface PlanningFactor {
  id: string;
  label: string;
  description: string;
}

const DEFAULT_ITEMS: PlanningFactor[] = [
  {
    id: "arrival-departure",
    label: "Arrival & Departure Cities",
    description: "Which city you fly into and out of shapes the entire route — and what connections make sense along the way.",
  },
  {
    id: "destinations",
    label: "Destinations",
    description: "The cities you want to visit, and the order that makes the most sense given routing and schedules.",
  },
  {
    id: "travel-time",
    label: "Travel Time",
    description: "How much time you have available, and how that's best spent between destinations versus in transit.",
  },
  {
    id: "flight-structure",
    label: "Flight Structure",
    description: "Whether a one-way, open-jaw, or fully round-trip structure fits your itinerary best.",
  },
  {
    id: "cabin-preference",
    label: "Cabin Preference",
    description: "Economy, Premium Economy, Business, or a mix — availability varies by route and airline.",
  },
  {
    id: "fare-flexibility",
    label: "Fare Flexibility",
    description: "Whether you need the ability to change dates or routing, and how that affects the fares available to you.",
  },
];

export interface PlanningFactorsSectionProps {
  heading?: string;
  subheading?: string;
  items?: PlanningFactor[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function PlanningFactorsSection({
  heading = "What We Consider When Planning Your Route",
  subheading = "We look beyond individual flights to understand how the complete journey fits together.",
  items = DEFAULT_ITEMS,
}: PlanningFactorsSectionProps = {}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
          {items.map((item, index) => (
            <SectionReveal key={item.id} delay={index * 0.05}>
              <h3 className="text-lg text-navy-deep">{item.label}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-text-gray">{item.description}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
