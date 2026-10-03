import Image from "next/image";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

const DEFAULT_COLUMNS: string[][] = [
  ["Flexible First Class fares", "Refundable First Class fares", "Partially refundable fares", "One-way First Class fares"],
  ["Round-trip First Class fares", "Multi-city fare structures", "Mixed-cabin itineraries"],
];

export interface FirstClassFareSectionProps {
  heading?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  backgroundImage?: string;
  subheading?: string;
  twoColumnItems?: string[][];
}

/** A dark cinematic section split into an intro (heading, body, button) on
 * the left and a subheading-plus-two-column-list on the right — its own
 * component since that specific pairing doesn't match `ComplexitySection`
 * (heading+list spans the full width there, with no button) or any other
 * existing dark section. All props optional, falling back to the current
 * hardcoded default — see `Hero.tsx` for the rationale. */
export function FirstClassFareSection({
  heading = "Understand Your First Class Fare Before You Travel",
  body = "A First Class ticket can still have restrictions on changes, cancellations or refunds.",
  buttonLabel = "Compare First Class Fare Options",
  buttonHref = "#connect",
  backgroundImage = unsplash("1533929736458-ca588d08c8be"),
  subheading = "Depending on the airline, route and fare structure, options may include:",
  twoColumnItems = DEFAULT_COLUMNS,
}: FirstClassFareSectionProps = {}) {
  const columns = twoColumnItems.length === 2 ? twoColumnItems : [twoColumnItems[0] ?? [], twoColumnItems[1] ?? []];

  return (
    <section className="relative flex min-h-[360px] items-center overflow-hidden bg-navy-deep py-10 sm:min-h-[440px] sm:py-14">
      <Image src={backgroundImage} alt="A city skyline at dusk" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/30" />

      <div className="content-container relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <SectionReveal>
          <h2 className="text-2xl leading-tight text-white sm:text-4xl lg:text-[32px]">{heading}</h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/80">{body}</p>
          <div className="mt-7">
            <Button href={buttonHref} variant="gold">
              {buttonLabel}
            </Button>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <p className="text-[15px] font-semibold text-white">{subheading}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
            {columns.map((column, columnIndex) => (
              <ul key={columnIndex} className="space-y-2">
                {column.map((item) => (
                  <li key={item} className="text-[14px] text-white/80">
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
