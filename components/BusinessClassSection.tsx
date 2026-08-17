import Image from "next/image";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { BUSINESS_CLASS_IMAGE } from "@/data/content";

export function BusinessClassSection() {
  return (
    // `overflow-x-hidden`: the image/text below slide in via translateX —
    // clips that motion at the section boundary so it can never cause
    // page-level horizontal scroll if the reveal hasn't settled yet
    // (e.g. a fast scroll flick past the trigger point).
    <section id="business-class" className="overflow-x-hidden bg-off-white py-20 sm:py-28">
      <div className="content-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-80}>
          <div className="relative h-[320px] overflow-hidden rounded-card shadow-card sm:h-[420px] lg:h-[480px]">
            <Image
              src={BUSINESS_CLASS_IMAGE.src}
              alt={BUSINESS_CLASS_IMAGE.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </SectionReveal>

        <SectionReveal x={80} delay={0.1}>
          <span className="eyebrow">Built For Complex International Travel</span>
          <h2 className="mt-3 text-3xl font-bold text-text-dark sm:text-4xl lg:text-[42px]">
            Built For Complex International Travel
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-gray sm:text-lg">
            We specialize in the itineraries other agencies turn away — multi-city routings, mixed
            cabins, and premium international connections. Our advisors work each request by hand,
            sourcing fares across our full airline network so you get options built around your
            actual trip, not a generic search result.
          </p>
          <div className="mt-8">
            <Button href="#experts" variant="ghost">
              Learn More
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
