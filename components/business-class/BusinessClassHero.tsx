import Image from "next/image";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { SectionReveal } from "@/components/SectionReveal";
import { HERO_BACKGROUND_IMAGE } from "@/data/business-class-content";
import { parseQuoteQuery } from "@/lib/quoteQuery";

/** No prior search to pre-fill from (unlike `/quote`, reached after one) —
 * `parseQuoteQuery({})` gives the same sensible defaults `/quote` itself
 * falls back to when opened without query params. */
const DEFAULT_CRITERIA = parseQuoteQuery({});

export interface BusinessClassHeroProps {
  headingLines?: string[];
  description?: string;
  backgroundImage?: string;
}

/** The quote card previously floated past this section's bottom edge on
 * purpose — but the section also needs `overflow-hidden` to clip the
 * background image, which silently clipped that overflow too (the form's
 * own bottom padding and the benefits row underneath it). Kept fully
 * inside the section now: a fixed desktop height plus a fixed form-column
 * width, sized so the (now more compact) form comfortably fits with room
 * to spare, rather than relying on overflow past the boundary.
 *
 * All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function BusinessClassHero({
  headingLines = ["Business Class,", "Done Right."],
  description = "Complex international routing, premium cabins, and multi-city journeys — planned by specialists who evaluate every option so you don't have to.",
  backgroundImage,
}: BusinessClassHeroProps = {}) {
  const resolvedBackgroundImage = backgroundImage ?? HERO_BACKGROUND_IMAGE.src;

  return (
    <section className="relative overflow-hidden pt-20">
      <div className="absolute inset-0">
        <Image
          src={resolvedBackgroundImage}
          alt={HERO_BACKGROUND_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-deep/70" />
      </div>

      <div className="content-container relative grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_600px] lg:gap-10 lg:py-8">
        <SectionReveal className="text-center lg:pt-10 lg:text-left">
          <h1 className="mt-3 text-4xl font-normal text-white sm:text-5xl lg:text-[60px]">
            {headingLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-6 max-w-[550px] text-lg leading-relaxed text-white/80 sm:text-xl lg:mx-0">
            {description}
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1} x={40}>
          <QuoteForm criteria={DEFAULT_CRITERIA} phoneBarVariant="navy" />
        </SectionReveal>
      </div>
    </section>
  );
}
