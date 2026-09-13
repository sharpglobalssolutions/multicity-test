import { SectionReveal } from "@/components/SectionReveal";

export interface BusinessClassServiceItem {
  title: string;
  description: string;
}

const DEFAULT_SERVICES: BusinessClassServiceItem[] = [
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

export interface BusinessClassServicesProps {
  heading?: string;
  services?: BusinessClassServiceItem[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function BusinessClassServices({
  heading = "Business Class Services",
  services = DEFAULT_SERVICES,
}: BusinessClassServicesProps = {}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <SectionReveal key={service.title} delay={index * 0.05}>
              <h3 className="text-lg font-semibold text-text-dark">{service.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-gray">{service.description}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
