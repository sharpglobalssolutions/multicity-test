import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

/** One representative photo per city shown across the route cards below —
 * keyed by city name since `stops` only stores plain "City|Country" text
 * (see the field-schema note on `PopularRoute.stops`), the same reasoning
 * `SupportSection`'s `ITEM_LINKS` map uses for data the admin field-schema
 * model doesn't have a dedicated field for. Falls back to a generic
 * in-flight photo for any city not in this list. */
const CITY_IMAGE_MAP: Record<string, { src: string; alt: string }> = {
  "New York": {
    src: unsplash("1496442226666-8d4d0e62e6e9"),
    alt: "The Manhattan skyline viewed across the water at golden hour",
  },
  London: {
    src: unsplash("1513635269975-59663e0ac1ad"),
    alt: "The Elizabeth Tower and Houses of Parliament in London",
  },
  Paris: {
    src: unsplash("1502602898657-3e91760cbb34"),
    alt: "The Eiffel Tower rising above the rooftops of Paris at dusk",
  },
  Rome: {
    src: unsplash("1515542483964-5e8c63d7d89b"),
    alt: "The Colosseum in Rome",
  },
  Toronto: {
    src: unsplash("1674699244848-8180d8d12360"),
    alt: "The Toronto skyline and CN Tower across the water",
  },
  Amsterdam: {
    src: unsplash("1765217993856-6e323db338f0"),
    alt: "A tree-lined Amsterdam canal with boats",
  },
  Barcelona: {
    src: unsplash("1550834415-4b47996578ff"),
    alt: "The Sagrada Familia in Barcelona",
  },
  Madrid: {
    src: unsplash("1765208509314-39325e3d0390"),
    alt: "A Madrid cityscape of historic and modern architecture",
  },
  Chicago: {
    src: unsplash("1559673762-5a594c19fff6"),
    alt: "A low-angle view of the Chicago skyline",
  },
  Frankfurt: {
    src: unsplash("1780563897347-389f0a562371"),
    alt: "The Frankfurt skyline along the river at sunset",
  },
  Vienna: {
    src: unsplash("1662119430842-77b37d42f81f"),
    alt: "A grand domed building in Vienna",
  },
  Athens: {
    src: unsplash("1733338684153-0a0fe5c0665b"),
    alt: "The Acropolis columns in Athens",
  },
  "Los Angeles": {
    src: unsplash("1625331961398-26edb1e237ff"),
    alt: "An aerial view of Los Angeles city buildings",
  },
  Zurich: {
    src: unsplash("1742626301229-2436b0b440e9"),
    alt: "The Zurich skyline reflecting in the water",
  },
  Milan: {
    src: unsplash("1689115574436-a6f9f8ee8d30"),
    alt: "The Duomo di Milano cathedral",
  },
  Lisbon: {
    src: unsplash("1697389455920-f6759fecc581"),
    alt: "A Lisbon street with a clock tower",
  },
};

const DEFAULT_CITY_IMAGE = {
  src: unsplash("1474302770737-173ee21bab63"),
  alt: "A commercial aircraft climbing into a golden evening sky",
};

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
    stops:
      "Toronto|CANADA\nAmsterdam|NETHERLANDS\nBarcelona|SPAIN\nMadrid|SPAIN\nToronto|CANADA",
  },
  {
    id: "chicago-europe",
    number: "03",
    tag: "4 CITIES | ROUND TRIP",
    stops:
      "Chicago|USA\nFrankfurt|GERMANY\nVienna|AUSTRIA\nAthens|GREECE\nChicago|USA",
  },
  {
    id: "los-angeles-europe",
    number: "04",
    tag: "4 CITIES | ROUND TRIP",
    stops:
      "Los Angeles|USA\nZurich|SWITZERLAND\nMilan|ITALY\nLisbon|PORTUGAL\nLos Angeles|USA",
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
    <section className="bg-gray-light py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-4xl text-center">
          <h2 className="text-[28px] leading-[32px] text-text-dark">
            {heading}
          </h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">
            {subheading}
          </p>
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

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
                    {stops.map((stop, stopIndex) => {
                      const cityImage =
                        CITY_IMAGE_MAP[stop.city] ?? DEFAULT_CITY_IMAGE;
                      return (
                        <div
                          key={`${stop.city}-${stopIndex}`}
                          className="text-center"
                        >
                          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                            <Image
                              src={cityImage.src}
                              alt={cityImage.alt}
                              fill
                              sizes="120px"
                              className="object-cover"
                            />
                          </div>
                          <p className="mt-2 truncate text-[13px] font-semibold text-text-dark">
                            {stop.city}
                          </p>
                          <p className="truncate text-[11px] text-text-gray">
                            {stop.country}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </SectionReveal>
            );
          })}
        </div>

        <SectionReveal delay={0.15} className="mt-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-full border border-navy-deep/10 bg-white px-6 py-4 sm:flex-row">
            <p className="flex items-center gap-3 text-sm text-text-gray">
              <AlertTriangle
                size={20}
                className="shrink-0 text-gold"
                aria-hidden="true"
              />
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
