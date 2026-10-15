import Image from "next/image";
import { FlightSearch } from "@/components/FlightSearch";
import { SectionReveal } from "@/components/SectionReveal";
import { HERO_BACKGROUND_IMAGE } from "@/data/business-class-content";
import { unsplash } from "@/lib/images";

interface BusinessClassHeroTrustStat {
  id: string;
  value: string;
  label: string;
}

const DEFAULT_TRUST_STATS: BusinessClassHeroTrustStat[] = [
  { id: "safe", value: "100%", label: "Safe & Secure" },
  { id: "travellers", value: "1K+", label: "Travellers Served" },
  { id: "support", value: "24/7", label: "Concierge Support" },
];

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

      <div className="content-container relative grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-[60%_40%] lg:gap-10 lg:py-8">
        <SectionReveal className="text-center lg:pt-10 lg:text-left">
          <h1 className="mt-3 text-[35px] leading-[40px] font-semibold text-white">
            {headingLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-6 max-w-[550px] text-[16px] leading-[22px] text-white/80 lg:mx-0">
            {description}
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1} x={40}>
          <div className="rounded-[7px] bg-white p-6 shadow-soft ring-1 ring-navy-deep/[0.06] sm:p-8">
            <div className="mb-6 flex items-center gap-3 rounded-input bg-gradient-to-r from-navy-deep to-navy-secondary px-4 py-3 text-white">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white/40">
                <Image
                  src={unsplash("1573497491208-6b1acb260507")}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-wide">
                1869-504-657
              </span>
            </div>

            <FlightSearch variant="light" />

            <div className="mt-6 grid grid-cols-3 divide-x divide-navy-deep/10 border-t border-navy-deep/10 pt-5 text-center">
              {DEFAULT_TRUST_STATS.map((stat) => (
                <div key={stat.id} className="px-2">
                  <p className="text-lg font-medium text-navy-deep sm:text-xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-text-gray sm:text-[11px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
