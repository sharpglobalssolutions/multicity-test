import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { APPROACH_DIFFERENTIATORS, APPROACH_IMAGE, APPROACH_TEXT } from "@/data/about-content";

export function AboutApproach() {
  return (
    <section className="overflow-x-hidden bg-white py-16 sm:py-20">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-60} className="group relative aspect-[4/3] w-full overflow-hidden rounded-card sm:aspect-[16/11]">
          <Image
            src={APPROACH_IMAGE.src}
            alt={APPROACH_IMAGE.alt}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </SectionReveal>

        <SectionReveal x={60} delay={0.1}>
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">What Makes Our Approach Different?</h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-text-gray">{APPROACH_TEXT}</p>

          <ul className="mt-6 space-y-3">
            {APPROACH_DIFFERENTIATORS.map((item, index) => (
              <li key={item}>
                <SectionReveal
                  delay={0.25 + index * 0.08}
                  x={16}
                  className="flex items-center gap-3 text-[16px] font-medium text-text-dark"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                    <Check size={14} aria-hidden="true" />
                  </span>
                  {item}
                </SectionReveal>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="#connect"
              className="inline-flex items-center rounded-full bg-navy-deep px-7 py-3.5 text-[16px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy-dark hover:shadow-[0_12px_28px_-10px_rgba(4,22,39,0.5)]"
            >
              Discover Your Travel Plan
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
