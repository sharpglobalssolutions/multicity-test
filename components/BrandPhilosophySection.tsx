import { SectionReveal } from "@/components/SectionReveal";

const DEFAULT_BODY =
  "Travel should be about where you're going, not the stress of getting there. Our travel specialists tailor international and multi-city journeys around your schedule, comfort, cabin, flexibility and budget. From business travel to complex itineraries, we help you find the right routes, flights and fares — balancing comfort, convenience and value.";

export interface BrandPhilosophySectionProps {
  heading?: string;
  body?: string;
}

/** A short, text-only mission-statement band — no image, no items, no
 * button. All props optional, falling back to the current hardcoded
 * default — see `Hero.tsx` for the rationale. */
export function BrandPhilosophySection({
  heading = "Travel Advice Built Around Your Journey",
  body = DEFAULT_BODY,
}: BrandPhilosophySectionProps = {}) {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-4xl text-center">
          <h2 className="text-[28px] leading-[32px] text-text-dark">
            {heading}
          </h2>
          <p className="mt-5 text-[16px] leading-[22px] text-text-gray">
            {body}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
