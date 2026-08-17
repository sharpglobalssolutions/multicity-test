import Image from "next/image";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { PERSONALIZED_JOURNEY_IMAGE } from "@/data/content";

export function PersonalizedJourney() {
  return (
    // overflow-x-hidden: see BusinessClassSection — clips the image's
    // translateX reveal so it can never cause page-level horizontal scroll.
    <section className="overflow-x-hidden bg-white py-20 sm:py-28">
      <div className="content-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal y={24}>
          <span className="eyebrow">Tailored For You</span>
          <h2 className="mt-3 text-3xl font-bold text-text-dark sm:text-4xl lg:text-[42px]">
            Your Journey Is Personal.
          </h2>
          <p className="mt-2 text-xl font-semibold text-navy-deep sm:text-2xl">Your flight should be too.</p>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-gray sm:text-lg">
            No two trips are the same, so we don&apos;t treat them that way. Tell us what matters —
            schedule, cabin, budget, loyalty program — and an advisor builds a shortlist around it,
            not the other way around.
          </p>
          <div className="mt-8">
            <Button href="#connect" variant="primary">
              Plan My Trip
            </Button>
          </div>
        </SectionReveal>

        <SectionReveal x={80} delay={0.1}>
          <div className="relative h-[320px] overflow-hidden rounded-card shadow-card sm:h-[420px] lg:h-[480px]">
            <Image
              src={PERSONALIZED_JOURNEY_IMAGE.src}
              alt={PERSONALIZED_JOURNEY_IMAGE.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
