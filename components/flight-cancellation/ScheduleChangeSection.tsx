import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

const DEFAULT_HEADING_LINES = ["What Happens If the", "Airline Changes Your Flight?"];

const DEFAULT_FLOW_STEPS = [
  "Original Itinerary",
  "Airline Schedule Change",
  "Accept New Schedule",
  "Rebook",
  "Review Refund Eligibility",
  "Restructure Journey",
];

export interface ScheduleChangeSectionProps {
  headingLines?: string[];
  body?: string;
  rightHeading?: string;
  /** Newline-separated — see `CnxScheduleChangeSectionData` in
   * `types/page-sections.ts` for why a plain bullet column is stored as
   * one string rather than a real array. */
  rightColumnA?: string;
  rightColumnB?: string;
  /** An optional closing line below the two-column list — added for the
   * International Flight Booking page's "Popular North Atlantic Routes"
   * instance. Every existing caller omits it. */
  rightNote?: string;
  /** Both optional (unset skips the flow-chain footer entirely) — added
   * for the International Flight Booking page's "Popular North Atlantic
   * Routes" instance, which has no step sequence. Every existing caller
   * sets both. */
  flowLabel?: string;
  flowSteps?: string[];
  backgroundImage?: string;
}

/** A one-off cinematic section pairing a two-column "what you may be able
 * to consider" list with a labelled, arrow-connected flow sequence below —
 * its own component since nothing else on the site combines a full-bleed
 * photo section with a step sequence like this. All props optional,
 * falling back to the current hardcoded default — see `Hero.tsx` for the
 * rationale. */
export function ScheduleChangeSection({
  headingLines = DEFAULT_HEADING_LINES,
  body = "An airline-initiated schedule change is different from choosing not to travel. If the airline changes your departure time, connection, routing or operating flight, alternative options may be available depending on the extent of the change and the applicable conditions.",
  rightHeading = "You may be able to consider:",
  rightColumnA = "Accepting the new schedule\nRequesting another flight\nReviewing alternative routing",
  rightColumnB = "Checking refund eligibility\nChanging connection points\nAdjusting related itinerary segments",
  rightNote,
  flowLabel = "Your Options May Include",
  flowSteps = DEFAULT_FLOW_STEPS,
  backgroundImage = unsplash("1436491865332-7a61a109cc05"),
}: ScheduleChangeSectionProps = {}) {
  const columnA = rightColumnA.split("\n").filter(Boolean);
  const columnB = rightColumnB.split("\n").filter(Boolean);

  return (
    <section className="relative overflow-hidden bg-navy-deep py-14 sm:py-20">
      <Image src={backgroundImage} alt="An aircraft wing above the clouds during a sunset flight" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40" />

      <div className="content-container relative z-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionReveal x={-30}>
            <h2 className="text-2xl leading-tight text-white sm:text-4xl lg:text-[30px]">
              {headingLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/80">{body}</p>
          </SectionReveal>

          <SectionReveal x={30} delay={0.1}>
            <h3 className="text-xl text-white sm:text-2xl">{rightHeading}</h3>
            <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2.5">
              <ul className="space-y-2.5">
                {columnA.map((item) => (
                  <li key={item} className="text-[15px] font-medium text-white/90">
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="space-y-2.5">
                {columnB.map((item) => (
                  <li key={item} className="text-[15px] font-medium text-white/90">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {rightNote ? <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/80">{rightNote}</p> : null}
          </SectionReveal>
        </div>

        {flowSteps.length > 0 ? (
          <SectionReveal delay={0.2} className="mt-14 border-t border-white/15 pt-8">
            <p className="text-lg text-white">{flowLabel}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3 text-[15px] font-medium text-white/90">
              {flowSteps.map((step, index) => (
                <span key={step} className="flex items-center gap-2">
                  {step}
                  {index < flowSteps.length - 1 ? (
                    <ArrowRight size={14} className="text-gold" aria-hidden="true" />
                  ) : null}
                </span>
              ))}
            </div>
          </SectionReveal>
        ) : null}
      </div>
    </section>
  );
}
