import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

const DEFAULT_LEFT_PARAGRAPHS = [
  "Choosing an airline is only one part of the decision.",
  "The aircraft operating your flight can affect the cabin layout, suite design, seat configuration and overall First Class experience.",
];

const DEFAULT_RIGHT_PARAGRAPHS = [
  "A useful way to compare your options is: Airline → Aircraft → Cabin Product → Seat/Suite → Overall Experience.",
  "The same airline can offer different First Class environments across its aircraft.",
  "That's why we encourage travellers to look beyond the airline name when comparing international First Class flights.",
  "Aircraft assignments can change for operational reasons, and specific equipment cannot always be guaranteed.",
];

export interface FirstClassAircraftSectionProps {
  headingLines?: string[];
  leftParagraphs?: string[];
  rightParagraphs?: string[];
  backgroundImage?: string;
}

/** A dark cinematic section with two plain text columns side by side — no
 * image/list pairing like `ComplexitySection`, just the background photo
 * behind both columns of copy. Its own component since the two-column-of-
 * paragraphs shape doesn't match anything else on the site. All props
 * optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function FirstClassAircraftSection({
  headingLines = ["Why the Aircraft Matters", "in First Class"],
  leftParagraphs = DEFAULT_LEFT_PARAGRAPHS,
  rightParagraphs = DEFAULT_RIGHT_PARAGRAPHS,
  backgroundImage = unsplash("1436491865332-7a61a109cc05"),
}: FirstClassAircraftSectionProps = {}) {
  return (
    <section className="relative flex min-h-[360px] items-center overflow-hidden bg-navy-deep py-10 sm:min-h-[440px] sm:py-14">
      <Image src={backgroundImage} alt="An aircraft wing above the clouds during a sunset flight" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />

      <div className="content-container relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <SectionReveal>
          <h2 className="text-2xl leading-tight text-white sm:text-4xl lg:text-[30px] font-semibold">
            {headingLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>
          {leftParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`max-w-sm text-[15px] leading-relaxed text-white/80 ${index === 0 ? "mt-5" : "mt-4"}`}
            >
              {paragraph}
            </p>
          ))}
        </SectionReveal>

        <SectionReveal delay={0.1}>
          {rightParagraphs.map((paragraph, index) => (
            <p key={index} className={`max-w-md text-[15px] leading-relaxed text-white/80 ${index === 0 ? "" : "mt-4"}`}>
              {paragraph}
            </p>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
