import Image from "next/image";
import { Button } from "@/components/Button";
import { FlightSearch } from "@/components/FlightSearch";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

export interface MultiCityHeroTrustStat {
  id: string;
  value: string;
  label: string;
}

const DEFAULT_HEADING_LINES = ["Multi-City Flights to Europe,", "Built Around Your Journey"];

const DEFAULT_PARAGRAPHS = [
  "Planning to visit several European destinations? A multi-city itinerary can help you see more while avoiding unnecessary backtracking.",
  "From the USA or Canada to London, Paris, Rome, Amsterdam and beyond, our travel specialists help you explore routes, airlines and flight options around your plans.",
];

const DEFAULT_TRUST_STATS: MultiCityHeroTrustStat[] = [
  { id: "safe", value: "100%", label: "Safe & Secure" },
  { id: "travellers", value: "250K+", label: "Travellers Served" },
  { id: "support", value: "24/7", label: "Concierge Support" },
];

export interface MultiCityHeroProps {
  headingLines?: string[];
  paragraphs?: string[];
  backgroundImage?: string;
  buttonLabel?: string;
  buttonHref?: string;
  phoneNumber?: string;
  phoneHeaderImage?: string;
  trustStats?: MultiCityHeroTrustStat[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. The right-hand quote card reuses the exact
 * same `FlightSearch` component/logic the homepage Hero uses (see its
 * `variant="light"` doc comment) — only a phone header bar and a trust-stats
 * row are added around it here, not a re-implementation of the form. */
export function MultiCityHero({
  headingLines = DEFAULT_HEADING_LINES,
  paragraphs = DEFAULT_PARAGRAPHS,
  backgroundImage = unsplash("1502602898657-3e91760cbb34"),
  buttonLabel = "Plan My Europe Journey",
  buttonHref = "#connect",
  phoneNumber = "1869-504-657",
  phoneHeaderImage = unsplash("1573497491208-6b1acb260507"),
  trustStats = DEFAULT_TRUST_STATS,
}: MultiCityHeroProps = {}) {
  return (
    <section className="relative flex min-h-[650px] items-center overflow-hidden bg-navy-deep pb-16 pt-32 sm:min-h-[700px] lg:min-h-[750px] lg:pt-24">
      <Image
        src={backgroundImage}
        alt="A European city skyline at dusk"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/50 to-navy-deep/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />

      <div className="content-container relative z-10 grid items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-10">
        <div>
          <h1 className="text-2xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[40px]">
            {headingLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h1>

          <SectionReveal delay={0.3}>
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`max-w-md text-base leading-relaxed text-white/80 sm:text-lg ${index === 0 ? "mt-6" : "mt-4"}`}
              >
                {paragraph}
              </p>
            ))}
          </SectionReveal>

          <SectionReveal delay={0.45}>
            <div className="mt-8">
              <Button href={buttonHref} variant="gold">
                {buttonLabel}
              </Button>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal scale={0.95} delay={0.2} className="lg:justify-self-end lg:w-full">
          <div className="rounded-[7px] bg-white p-6 shadow-soft ring-1 ring-navy-deep/[0.06] sm:p-8">
            <div className="mb-6 flex items-center gap-3 rounded-input bg-gradient-to-r from-navy-deep to-navy-secondary px-4 py-3 text-white">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white/40">
                <Image src={phoneHeaderImage} alt="" fill sizes="44px" className="object-cover" />
              </div>
              <span className="text-xl font-bold tracking-wide">{phoneNumber}</span>
            </div>

            <FlightSearch variant="light" />

            <div className="mt-6 grid grid-cols-3 divide-x divide-navy-deep/10 border-t border-navy-deep/10 pt-5 text-center">
              {trustStats.map((stat) => (
                <div key={stat.id} className="px-2">
                  <p className="text-lg font-bold text-navy-deep sm:text-xl">{stat.value}</p>
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
