import { FileText } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";

export interface HowItWorksStep {
  id: string;
  /** Newline-separated — the admin field-schema list editor only supports
   * scalar item fields, so a step's multi-line title/description is
   * stored as one string and split here at render time (the same
   * reasoning `subheading`-style fields elsewhere store one HTML string
   * rather than structured data). */
  titleLines: string;
  descriptionLines: string;
}

const DEFAULT_STEPS: HowItWorksStep[] = [
  { id: "tell-us", titleLines: "Tell Us Your\nJourney", descriptionLines: "Route, dates & preferences." },
  {
    id: "we-research",
    titleLines: "We Research\nYour Options",
    descriptionLines: "Our specialists evaluate available\nBusiness Class possibilities.",
  },
  { id: "choose-option", titleLines: "Choose Your\nOption", descriptionLines: "We present the options.\nYou decide." },
];

export interface HowItWorksProps {
  heading?: string;
  subheading?: string;
  steps?: HowItWorksStep[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function HowItWorks({
  heading = "How It Works",
  subheading = "A Better Way to Find Your Business Class Journey.",
  steps = DEFAULT_STEPS,
}: HowItWorksProps = {}) {
  return (
    <section className="bg-white py-[76px] sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] font-medium uppercase tracking-[0.04em] text-[#07111F] sm:text-[32px]">
            {heading}
          </h2>
          <p className="mt-2.5 text-[20px] font-normal text-[#9A9A9A] sm:text-[23px]">{subheading}</p>
        </SectionReveal>

        <div className="relative mt-12 sm:mt-[52px]">
          <div className="pointer-events-none absolute left-1/3 top-1/2 hidden h-[115px] w-px -translate-y-1/2 bg-[#1A2430]/15 sm:block" />
          <div className="pointer-events-none absolute left-2/3 top-1/2 hidden h-[115px] w-px -translate-y-1/2 bg-[#1A2430]/15 sm:block" />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            {steps.map((step, index) => (
              <SectionReveal key={step.id} delay={index * 0.1} className="text-center">
                <FileText size={36} strokeWidth={1.5} className="mx-auto text-[#B59655]" aria-hidden="true" />
                <h3 className="mt-[27px] text-[21px] font-medium leading-snug text-[#07111F]">
                  {step.titleLines.split("\n").map((line, lineIndex) => (
                    <span key={lineIndex} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#9A9A9A]">
                  {step.descriptionLines.split("\n").map((line, lineIndex) => (
                    <span key={lineIndex} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
