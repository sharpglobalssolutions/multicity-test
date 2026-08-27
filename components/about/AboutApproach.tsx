import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { APPROACH_DIFFERENTIATORS, APPROACH_IMAGE, APPROACH_TEXT } from "@/data/about-content";

export function AboutApproach() {
  return (
    <section className="overflow-x-hidden bg-white py-16 sm:py-20">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-60}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card sm:aspect-[16/11]">
            <Image
              src={APPROACH_IMAGE.src}
              alt={APPROACH_IMAGE.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </SectionReveal>

        <SectionReveal x={60} delay={0.1}>
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">What Makes Our Approach Different?</h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-text-gray">{APPROACH_TEXT}</p>

          <ul className="mt-6 space-y-3">
            {APPROACH_DIFFERENTIATORS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[16px] font-medium text-text-dark">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <Check size={14} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="#connect"
              className="inline-flex items-center rounded-full bg-navy-deep px-7 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-navy-dark"
            >
              Discover Your Travel Plan
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
