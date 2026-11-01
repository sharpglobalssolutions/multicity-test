import Image from "next/image";
import { Check } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import {
  BEYOND_FARE_IMAGE,
  BEYOND_FARE_INTRO,
  BEYOND_FARE_ITEMS,
} from "@/data/why-choose-us-content";

/** Same image + two-column checklist layout as `AboutWhyChooseUs`, with an
 * added intro paragraph above the list for this page's copy. */
export function WhyChooseBeyondFare() {
  return (
    <section className="overflow-x-hidden bg-white py-10 sm:py-14">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal
          x={-60}
          className="group relative aspect-[4/3] w-full overflow-hidden rounded-card sm:aspect-[16/11]"
        >
          <Image
            src={BEYOND_FARE_IMAGE.src}
            alt={BEYOND_FARE_IMAGE.alt}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </SectionReveal>

        <SectionReveal x={60} delay={0.1}>
          <h2 className="text-[28px] leading-[32px] text-text-dark">
            Beyond the Fare: What We Look At
          </h2>
          <p className="mt-5 max-w-lg text-[13px] leading-[18px] text-text-gray">
            {BEYOND_FARE_INTRO}
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {BEYOND_FARE_ITEMS.map((item, index) => (
              <li key={item}>
                <SectionReveal
                  delay={0.25 + index * 0.05}
                  x={12}
                  className="flex items-center gap-3 text-[13px] leading-[18px] font-medium text-navy-deep"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                    <Check size={12} aria-hidden="true" />
                  </span>
                  {item}
                </SectionReveal>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
}
