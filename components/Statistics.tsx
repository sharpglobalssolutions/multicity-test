"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { STATS } from "@/data/content";

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

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = useCountUp(value, inView);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-[52px]">
        {count}
        <span className="text-emerald-bright">{suffix}</span>
      </div>
      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-white/70">{label}</p>
    </div>
  );
}

export function Statistics() {
  return (
    <section className="bg-navy-dark py-16 sm:py-20">
      <div className="content-container grid grid-cols-1 gap-10 sm:grid-cols-3">
        {STATS.map((stat) => (
          <StatItem key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
