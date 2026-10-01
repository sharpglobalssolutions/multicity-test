import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";

export interface PopularRoute {
  id: string;
  number: string;
  tag: string;
  /** Newline-separated `City|Country` pairs — see `HowItWorksStep` in
   * `components/business-class/HowItWorks.tsx` for why a route's variable-
   * length stop list is stored as one string rather than a nested list the
   * admin field-schema model doesn't support. */
  stops: string;
}

function parseStops(stops: string): { city: string; country: string }[] {
  return stops
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [city, country] = line.split("|");
      return { city: city?.trim() ?? "", country: country?.trim() ?? "" };
    });
}

const DEFAULT_ROUTES: PopularRoute[] = [
  {
    id: "new-york-europe",
    number: "01",
    tag: "4 CITIES | ROUND TRIP",
    stops: "New York|USA\nLondon|UK\nParis|FRANCE\nRome|ITALY\nNew York|USA",
  },
  {
    id: "toronto-europe",
    number: "02",
    tag: "4 CITIES | ROUND TRIP",
    stops: "Toronto|CANADA\nAmsterdam|NETHERLANDS\nBarcelona|SPAIN\nMadrid|SPAIN\nToronto|CANADA",
  },
  {
    id: "chicago-europe",
    number: "03",
    tag: "4 CITIES | ROUND TRIP",
    stops: "Chicago|USA\nFrankfurt|GERMANY\nVienna|AUSTRIA\nAthens|GREECE\nChicago|USA",
  },
  {
    id: "los-angeles-europe",
    number: "04",
    tag: "4 CITIES | ROUND TRIP",
    stops: "Los Angeles|USA\nZurich|SWITZERLAND\nMilan|ITALY\nLisbon|PORTUGAL\nLos Angeles|USA",
  },
];

export interface PopularRoutesSectionProps {
  heading?: string;
  subheading?: string;
  routes?: PopularRoute[];
  noticeText?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function PopularRoutesSection({
  heading = "Popular Multi-City Routes to Europe",
  subheading = "Looking for inspiration? Some possible routes include:",
  routes = DEFAULT_ROUTES,
  noticeText = "These are examples, not fixed travel packages. Routes, fares and availability depend on your travel dates and requirements.",
  buttonLabel = "Build My Own Route",
  buttonHref = "#connect",
}: PopularRoutesSectionProps = {}) {
  return (
    <section className="bg-gray-light py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {routes.map((route, index) => {
            const stops = parseStops(route.stops);
            return (
              <SectionReveal key={route.id} delay={index * 0.05}>
                <article className="rounded-card border border-navy-deep/10 bg-white p-6">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-text-gray">
                    <span>{route.number}</span>
                    <span>{route.tag}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
                    {stops.map((stop, stopIndex) => (
                      <div key={`${stop.city}-${stopIndex}`} className="text-center">
                        <div className="aspect-square w-full rounded-lg bg-navy-deep" aria-hidden="true" />
                        <p className="mt-2 truncate text-[13px] font-semibold text-text-dark">{stop.city}</p>
                        <p className="truncate text-[11px] text-text-gray">{stop.country}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </SectionReveal>
            );
          })}
        </div>

        <SectionReveal delay={0.15} className="mt-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-full border border-navy-deep/10 bg-white px-6 py-4 sm:flex-row">
            <p className="flex items-center gap-3 text-sm text-text-gray">
              <AlertTriangle size={20} className="shrink-0 text-gold" aria-hidden="true" />
              {noticeText}
            </p>
            <Button href={buttonHref} variant="navy" className="shrink-0">
              {buttonLabel}
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
