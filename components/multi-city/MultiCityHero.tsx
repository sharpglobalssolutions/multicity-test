import { PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { FlightSearch } from "@/components/FlightSearch";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

export interface MultiCityHeroTrustStat {
  id: string;
  value: string;
  label: string;
}

const DEFAULT_HEADING_LINES = [
  "Multi-City Flights to Europe,",
  "Built Around Your Journey",
];

const DEFAULT_PARAGRAPHS = [
  "Planning to visit several European destinations? A multi-city itinerary can help you see more while avoiding unnecessary backtracking.",
  "From the USA or Canada to London, Paris, Rome, Amsterdam and beyond, our travel specialists help you explore routes, airlines and flight options around your plans.",
];

const DEFAULT_TRUST_STATS: MultiCityHeroTrustStat[] = [
  { id: "safe", value: "100%", label: "Safe & Secure" },
  { id: "travellers", value: "1K+", label: "Travellers Served" },
  { id: "support", value: "24/7", label: "Concierge Support" },
];

export interface MultiCityHeroProps {
  headingLines?: string[];
  /** An optional second, smaller heading line between `headingLines` and
   * `paragraphs` — added for the Flight Change page's hero ("Need to
   * Change Your Flight? We're Here to Help."). Every existing caller
   * omits it. */
  subheading?: string;
  paragraphs?: string[];
  backgroundImage?: string;
  buttonLabel?: string;
  buttonHref?: string;
  phoneNumber?: string;
  trustStats?: MultiCityHeroTrustStat[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. The right-hand quote card reuses the exact
 * same `FlightSearch` component/logic the homepage Hero uses (see its
 * `variant="light"` doc comment) — only a phone header bar and a trust-stats
 * row are added around it here, not a re-implementation of the form. */
export function MultiCityHero({
  headingLines = DEFAULT_HEADING_LINES,
  subheading,
  paragraphs = DEFAULT_PARAGRAPHS,
  backgroundImage = unsplash("1502602898657-3e91760cbb34"),
  buttonLabel = "Plan My Europe Journey",
  buttonHref = "#connect",
  phoneNumber = "1869-504-657",
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
        <div className="order-2 lg:order-1">
          <h1 className="text-[35px] leading-[40px] font-semibold text-white">
            {headingLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h1>

          {subheading ? (
            <p className="mt-4 text-xl text-white/90 sm:text-2xl">
              {subheading}
            </p>
          ) : null}

          <SectionReveal delay={0.3}>
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`max-w-md text-[16px] leading-[22px] text-white/80 ${index === 0 ? "mt-6" : "mt-4"}`}
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

        <SectionReveal
          scale={0.95}
          delay={0.2}
          className="order-1 lg:order-2 lg:justify-self-end lg:w-full"
        >
          <div className="rounded-[7px] bg-white p-6 shadow-soft ring-1 ring-navy-deep/[0.06] sm:p-8">
            <Link
              href={`tel:${phoneNumber}`}
              className="mb-6 flex items-center justify-center gap-3 rounded-input bg-gradient-to-r from-navy-deep to-navy-secondary px-4 py-3 text-white transition-opacity hover:opacity-90"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-none bg-[#ab8a4b]">
                <PhoneCall size={20} aria-hidden="true" />
              </div>
              <span className="text-lg font-bold tracking-wide sm:text-2xl">
                {phoneNumber}
              </span>
            </Link>

            <FlightSearch variant="light" />

            <div className="mt-6 grid grid-cols-3 divide-x divide-navy-deep/10 border-t border-navy-deep/10 pt-5 text-center">
              {trustStats.map((stat) => (
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
