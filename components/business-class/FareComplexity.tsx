import { Armchair, CalendarClock, Plane, RefreshCw, Route, ScrollText } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";

/** DB-provided items carry an icon *key* (JSON can't store a component
 * reference) — resolved to the actual Lucide component here. Same pattern
 * as `EXPERT_ICON_MAP` in `ExpertsSection.tsx`. */
export const FARE_ICON_MAP = {
  route: Route,
  armchair: Armchair,
  "scroll-text": ScrollText,
  "calendar-clock": CalendarClock,
  plane: Plane,
  "refresh-cw": RefreshCw,
} as const;

export type FareIconKey = keyof typeof FARE_ICON_MAP;

export interface FareComplexityItem {
  id: string;
  label: string;
  icon: FareIconKey;
}

const DEFAULT_ITEMS: FareComplexityItem[] = [
  { id: "routing", label: "Routing", icon: "route" },
  { id: "cabin-class", label: "Cabin Class", icon: "armchair" },
  { id: "fare-rules", label: "Fare Rules", icon: "scroll-text" },
  { id: "availability", label: "Availability", icon: "calendar-clock" },
  { id: "airlines", label: "Airlines", icon: "plane" },
  { id: "flexibility", label: "Flexibility", icon: "refresh-cw" },
];

export interface FareComplexityProps {
  heading?: string;
  subheading?: string;
  items?: FareComplexityItem[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function FareComplexity({
  heading = "Why Business Class Fares Are Complex",
  subheading = "What Affects Your Fare, Flexibility & Options",
  items = DEFAULT_ITEMS,
}: FareComplexityProps = {}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item, index) => {
            const Icon = FARE_ICON_MAP[item.icon];
            return (
              <SectionReveal key={item.id} delay={index * 0.05} className="flex flex-col items-center gap-3 text-center">
                <span className="flex size-16 items-center justify-center rounded-full border border-navy-deep/10 bg-gray-light text-navy-deep">
                  <Icon size={26} aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-text-dark">{item.label}</p>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
