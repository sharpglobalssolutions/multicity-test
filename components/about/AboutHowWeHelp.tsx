import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { HOW_WE_HELP_IMAGE } from "@/data/about-content";

// The header's existing "call an expert" action — see components/Header.tsx.
const CALL_EXPERT_HREF = "tel:1869-504-657";

export function AboutHowWeHelp() {
  return (
    <section className="overflow-x-hidden bg-white py-16 sm:py-20">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-60} className="group relative aspect-[4/3] w-full overflow-hidden rounded-card sm:aspect-[16/11]">
          <Image
            src={HOW_WE_HELP_IMAGE.src}
            alt={HOW_WE_HELP_IMAGE.alt}
            fill
            loading="eager"
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </SectionReveal>

        <SectionReveal x={60} delay={0.1}>
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">How We Help Travellers</h2>
          <p className="mt-6 text-lg font-semibold text-navy-deep">Contact a Travel Specialist</p>
          <p className="mt-2 max-w-lg text-[16px] leading-relaxed text-text-gray">Call us or submit an enquiry.</p>
          <div className="mt-8">
            <a
              href={CALL_EXPERT_HREF}
              className="inline-flex items-center rounded-full bg-navy-deep px-7 py-3.5 text-[16px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-navy-dark hover:shadow-[0_12px_28px_-10px_rgba(4,22,39,0.5)]"
            >
              Call an Expert
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
