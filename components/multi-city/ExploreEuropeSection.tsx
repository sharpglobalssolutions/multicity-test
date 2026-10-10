import Image from "next/image";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

const DEFAULT_HEADING_LINES = ["Explore Europe From", "the USA or Canada"];

export interface ExploreEuropeSectionProps {
  headingLines?: string[];
  subheading?: string;
  buttonLabel?: string;
  buttonHref?: string;
  backgroundImage?: string;
  rightHeading?: string;
  rightBody?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function ExploreEuropeSection({
  headingLines = DEFAULT_HEADING_LINES,
  subheading = "Your journey could connect destinations such as:",
  buttonLabel = "Plan My Europe Journey",
  buttonHref = "#connect",
  backgroundImage = unsplash("1513635269975-59663e0ac1ad"),
  rightHeading = "London • Paris • Amsterdam • Frankfurt • Zurich • Madrid • Barcelona • Lisbon • Rome • Milan • Vienna • Athens",
  rightBody = "Departures may include New York, Chicago, Miami, Los Angeles, Toronto, Vancouver or Montreal, depending on your requirements and available flight options.",
}: ExploreEuropeSectionProps = {}) {
  return (
    <section className="relative flex min-h-[360px] items-center overflow-hidden bg-navy-deep py-10 sm:min-h-[440px] sm:py-14">
      <Image src={backgroundImage} alt="A European city skyline at dusk" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      <div className="content-container relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <SectionReveal>
          <h2 className="text-2xl sm:text-4xl lg:text-[30px] font-semibold leading-tight text-white">
            {headingLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">{subheading}</p>
          <div className="mt-8">
            <Button href={buttonHref} variant="gold">
              {buttonLabel}
            </Button>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <p className="text-[15px] font-medium leading-relaxed text-white sm:text-base">{rightHeading}</p>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">{rightBody}</p>
        </SectionReveal>
      </div>
    </section>
  );
}
