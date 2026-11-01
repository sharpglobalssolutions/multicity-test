import { Check } from "lucide-react";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";

const DEFAULT_ITEMS = [
  "Departure city or airport",
  "First destination",
  "Cities or countries you plan to visit",
  "Expected final destination",
  "Departure date",
  "Approximate return date, if known",
  "Flexible dates",
  "Number of travellers",
  "Cabin preference",
  "Preferred airlines",
  "One-way, open-jaw or multi-city preference",
  "Rail travel plans",
  "Business Class interest",
  "Flexible fare requirements",
  "Any additional travel needs",
];

export interface ChecklistSectionProps {
  heading?: string;
  subheading?: string;
  items?: string[];
  buttonLabel?: string;
  buttonHref?: string;
}

/** A text-only, three-column checklist with a centered CTA — its own
 * component since nothing else on the site pairs a plain checkmark grid
 * (no image, no cards) with a closing button like this. All props
 * optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function ChecklistSection({
  heading = "What Should You Tell Us About Your Journey?",
  subheading = "You don't need to have every detail figured out. It helps to share:",
  items = DEFAULT_ITEMS,
  buttonLabel = "Plan My Journey",
  buttonHref = "#connect",
}: ChecklistSectionProps = {}) {
  return (
    <section className="bg-gray-light py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[28px] leading-[32px] text-text-dark">
            {heading}
          </h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">
            {subheading}
          </p>
        </SectionReveal>

        <SectionReveal
          delay={0.1}
          className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                <Check size={12} aria-hidden="true" />
              </span>
              <span className="text-[13px] leading-[15px] text-text-dark">
                {item}
              </span>
            </div>
          ))}
        </SectionReveal>

        <SectionReveal delay={0.15} className="mt-10 text-center">
          <Button href={buttonHref} variant="navy">
            {buttonLabel}
          </Button>
        </SectionReveal>
      </div>
    </section>
  );
}
