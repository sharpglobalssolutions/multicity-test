"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { STATS, type Stat } from "@/data/content";

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

function StatItem({ value, suffix, label, displayValue }: Omit<Stat, "id">) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = useCountUp(value, inView);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-[22px] font-bold text-text-dark sm:text-5xl lg:text-[28px]">
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

// Tailwind needs the literal class name present somewhere in source to
// generate it — a computed string like `sm:grid-cols-${n}` would be
// silently dropped from the production build, so known counts are looked
// up here instead.
const GRID_COLS_BY_COUNT: Record<number, string> = {
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export interface StatisticsProps {
  stats?: Stat[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. The divider lines between columns used to
 * be two fixed-position pseudo-elements (`left: 35%` / `right: 35%` in
 * `globals.css`) baked in for exactly 3 columns — replaced with a plain
 * `divide-x` on the grid so a different `stats.length` (e.g. the Business
 * Class page's 4-item stats bar) still gets evenly-placed dividers instead
 * of two lines landing in the wrong spot. */
export function Statistics({ stats = STATS }: StatisticsProps = {}) {
  const gridColsClass = GRID_COLS_BY_COUNT[stats.length] ?? "sm:grid-cols-3";

  return (
    <section className="bg-white py-5 shadow-[0_1px_2px_2px_rgba(3,24,39,0.2)] sm:py-5">
      <div className={`content-container grid grid-cols-1 divide-y divide-navy-deep/10 sm:divide-x sm:divide-y-0 ${gridColsClass}`}>
        {stats.map((stat) => (
          <div key={stat.id} className="py-4 sm:px-6 sm:py-0">
            <StatItem value={stat.value} suffix={stat.suffix} label={stat.label} displayValue={stat.displayValue} />
          </div>
        ))}
      </div>
    </section>
  );
}
