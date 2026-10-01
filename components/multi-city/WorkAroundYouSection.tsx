import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

const DEFAULT_HEADING_LINES = ["Multi-City Travel Should", "Work Around You"];

const DEFAULT_PARAGRAPHS = [
  "Whether you're planning a European holiday, business trip, family visit or extended stay, your itinerary should reflect how you actually want to travel.",
  "We help you explore options based on your destinations, schedule, cabin preference and travel priorities — not a predefined package.",
];

export interface WorkAroundYouSectionProps {
  headingLines?: string[];
  paragraphs?: string[];
  backgroundImage?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. A cinematic full-bleed background with
 * left-aligned text and no button — visually distinct from `FinalCTA`
 * (which is always paired with a button), so its own small component
 * rather than a forced reuse. */
export function WorkAroundYouSection({
  headingLines = DEFAULT_HEADING_LINES,
  paragraphs = DEFAULT_PARAGRAPHS,
  backgroundImage = unsplash("1474302770737-173ee21bab63"),
}: WorkAroundYouSectionProps = {}) {
  return (
    <section className="relative flex min-h-[420px] items-center overflow-hidden bg-navy-deep py-16 sm:min-h-[520px] sm:py-20">
      <Image src={backgroundImage} alt="A commercial aircraft climbing into a golden evening sky" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      <div className="content-container relative z-10">
        <SectionReveal className="max-w-lg">
          <h2 className="text-3xl leading-tight text-white sm:text-4xl lg:text-[34px]">
            {headingLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`max-w-md text-base leading-relaxed text-white/80 sm:text-lg ${index === 0 ? "mt-6" : "mt-4"}`}
            >
              {paragraph}
            </p>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
