import { SectionReveal } from "@/components/SectionReveal";

export interface BeyondPriceBenefit {
  id: string;
  title: string;
  description: string;
}

const DEFAULT_BENEFITS: BeyondPriceBenefit[] = [
  {
    id: "flight-options",
    title: "Better Flight Options",
    description: "We compare multiple airlines, routes, and fare types to find the best overall value.",
  },
  {
    id: "premium-cabin",
    title: "Premium Cabin Access",
    description: "Get access to exclusive fares, upgrades, and premium cabin inventory.",
  },
  {
    id: "flexible-routing",
    title: "Flexible Routing",
    description: "We explore alternative routes and connections to maximize savings and comfort.",
  },
  {
    id: "expert-recommendations",
    title: "Expert Recommendations",
    description: "Our specialists provide personalized advice based on your travel goals.",
  },
  {
    id: "peace-of-mind",
    title: "Peace of Mind",
    description: "Transparent guidance, no hidden fees, and full support from start to finish.",
  },
  {
    id: "dedicated-support",
    title: "Dedicated Support",
    description: "Our team is here to assist you before, during, and after your trip.",
  },
];

export interface BeyondPriceProps {
  eyebrow?: string;
  heading?: string[];
  benefits?: BeyondPriceBenefit[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function BeyondPrice({
  eyebrow = "Our Approach",
  heading = ["We Look Beyond", "the Price."],
  benefits = DEFAULT_BENEFITS,
}: BeyondPriceProps = {}) {
  return (
    <section className="bg-[#102B4C] py-10 text-white sm:py-12">
      <div className="content-container grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-10">
        <SectionReveal x={-30}>
          <p className="text-[22px] font-medium text-[#B59655] sm:text-[24px]">{eyebrow}</p>
          <h2 className="mt-3 text-[32px] font-normal leading-[1.15] text-white sm:text-[38px] lg:text-[42px]">
            {heading.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div className="mt-5 h-[3px] w-20 bg-white/80" />
        </SectionReveal>

        <SectionReveal x={30} delay={0.1}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="flex h-full flex-col gap-2 rounded-sm border border-[rgba(255,255,255,0.65)] p-4"
              >
                <h3 className="text-[17px] font-medium leading-snug text-white">{benefit.title}</h3>
                <p className="text-[14px] leading-snug text-[#B8C4D3]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
