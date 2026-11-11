import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { EXPERIENCE_BODY, EXPERIENCE_IMAGE } from "@/data/why-choose-us-content";

/** Same image + copy + CTA layout as `AboutHowWeHelp`. */
export function WhyChooseExperience() {
  return (
    <section className="overflow-x-hidden bg-white py-10 sm:py-14">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal
          x={-60}
          className="group relative aspect-[4/3] w-full overflow-hidden rounded-card sm:aspect-[16/11]"
        >
          <Image
            src={EXPERIENCE_IMAGE.src}
            alt={EXPERIENCE_IMAGE.alt}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </SectionReveal>

        <SectionReveal x={60} delay={0.1}>
          <h2 className="text-[28px] leading-[32px] text-text-dark">
            Experience That Understands Your Journey
          </h2>
          <div
            className="mt-5 max-w-lg text-[13px] leading-[18px] text-text-gray"
            dangerouslySetInnerHTML={{ __html: EXPERIENCE_BODY }}
          />
          <div className="mt-8">
            <a
              href="tel:1869-504-657"
              className="inline-flex items-center rounded-full bg-navy-deep px-7 py-3.5 text-[15px] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy-dark hover:shadow-[0_12px_28px_-10px_rgba(4,22,39,0.5)]"
            >
              Speak With a Specialist
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
