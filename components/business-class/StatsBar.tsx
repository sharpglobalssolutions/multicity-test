"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export interface BusinessClassStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  /** Overrides the animated `value`+`suffix` count-up with plain text —
   * for a stat that isn't a number at all (e.g. "One-Way" / "Multi-City"). */
  displayValue?: string;
}

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function StatItem({ value, suffix, label, displayValue }: Omit<BusinessClassStat, "id">) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = useCountUp(value, inView);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-[18px]  text-text-dark sm:text-5xl lg:text-[24px]">
        {displayValue ?? (
          <>
            {count}
            <span className="tex-[#0a0c11]">{suffix}</span>
          </>
        )}
      </div>
      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-text-gray">{label}</p>
    </div>
  );
}

const DEFAULT_STATS: BusinessClassStat[] = [
  { id: "years-experience", value: 11, suffix: "+", label: "Years Experience" },
  { id: "international-routes", value: 200, suffix: "+", label: "International Routes" },
  { id: "one-way", value: 0, suffix: "", label: "Expertise", displayValue: "One-Way" },
  { id: "multi-city", value: 0, suffix: "", label: "Expertise", displayValue: "Multi-City" },
];

export interface StatsBarProps {
  stats?: BusinessClassStat[];
}

/** Business Class page's own stats bar — a dedicated component (not the
 * homepage's `Statistics`), since this page's 4-item layout and mix of
 * animated/plain-text values doesn't belong on the shared homepage
 * component. All props optional, falling back to the current hardcoded
 * default — see `Hero.tsx` for the rationale. */
export function StatsBar({ stats = DEFAULT_STATS }: StatsBarProps = {}) {
  return (
    <section className="bg-white py-5 statistic-section-2 sm:py-5">
      <div className="content-container grid grid-cols-1 divide-y divide-navy-deep/30 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.id} className="py-4 sm:px-6 sm:py-0">
            <StatItem value={stat.value} suffix={stat.suffix} label={stat.label} displayValue={stat.displayValue} />
          </div>
        ))}
      </div>
    </section>
  );
}
