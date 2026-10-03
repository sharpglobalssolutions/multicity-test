"use client";

import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";

/** Swiper's gap between slides — shared by the `spaceBetween` prop and the
 * column-divider offset below so the two never drift out of sync. */
const SLIDE_GAP = 32;

export interface HowItWorksStep {
  id: string;
  /** Newline-separated — see `HowItWorksStep` in
   * `components/business-class/HowItWorks.tsx` for why a step's multi-line
   * title/description is stored as one string rather than a real array. */
  titleLines: string;
  descriptionLines: string;
}

const DEFAULT_STEPS: HowItWorksStep[] = [
  { id: "tell-us", titleLines: "Tell Us Your\nJourney", descriptionLines: "Route, dates & preferences." },
  {
    id: "we-explore",
    titleLines: "We Explore Possible\nItineraries",
    descriptionLines: "Our specialists evaluate available\nroutes and connections.",
  },
  {
    id: "compare-routes",
    titleLines: "Compare Routes\n& Flight Options",
    descriptionLines: "We present the options.\nYou decide.",
  },
  {
    id: "book-journey",
    titleLines: "Book With\nConfidence",
    descriptionLines: "Your specialist helps finalize\ndates and documentation.",
  },
];

export interface HowItWorksCarouselProps {
  heading?: string;
  subheading?: string;
  steps?: HowItWorksStep[];
}

/** A carousel variant of the Business Class page's static `HowItWorks`
 * grid (`components/business-class/HowItWorks.tsx`) — its own component
 * rather than adding carousel behavior to that shared one, since
 * `BC_HOW_IT_WORKS` reuses it as-is on the Business Class page and that
 * page didn't ask to become a carousel too. Same visual language (gold
 * `FileText` icon, centered title/description), navigated the same way as
 * `WhyChooseSection`'s feature carousel elsewhere on this page. All props
 * optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function HowItWorksCarousel({
  heading = "How Our Multi-City Flight Planning Works",
  subheading = "A Better Way to Plan Your European Journey.",
  steps = DEFAULT_STEPS,
}: HowItWorksCarouselProps = {}) {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] font-medium uppercase tracking-[0.04em] text-[#07111F] sm:text-[32px]">
            {heading}
          </h2>
          <p className="mt-2.5 text-[20px] font-normal text-[#9A9A9A] sm:text-[23px]">{subheading}</p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="relative mt-12 px-10 sm:mt-[52px] sm:px-12">
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: ".how-it-works-prev", nextEl: ".how-it-works-next" }}
            spaceBetween={SLIDE_GAP}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {steps.map((step, index) => (
              <SwiperSlide key={step.id} className="h-auto">
                <div className="relative h-full text-center">
                  <FileText size={36} strokeWidth={1.5} className="mx-auto text-[#B59655]" aria-hidden="true" />
                  <h3 className="mt-[27px] text-[21px] font-medium leading-snug text-[#07111F]">
                    {step.titleLines.split("\n").map((line, lineIndex) => (
                      <span key={lineIndex} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-[#9A9A9A]">
                    {step.descriptionLines.split("\n").map((line, lineIndex) => (
                      <span key={lineIndex} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                  {/* A divider between columns, same as the static grid this
                      replaces — centered in the gap Swiper leaves between
                      slides (`SLIDE_GAP / 2` past this slide's own edge), so
                      it reads as "between" rather than stuck to one side.
                      Skipped on the trailing slide, which has no neighbor to
                      its right to divide from. */}
                  {index < steps.length - 1 ? (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 hidden h-[115px] w-px -translate-y-1/2 bg-[#1A2430]/15 sm:block"
                      style={{ right: -(SLIDE_GAP / 2) }}
                    />
                  ) : null}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous"
            className="how-it-works-prev absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 text-navy-deep transition-colors hover:border-emerald hover:text-emerald"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="how-it-works-next absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 text-navy-deep transition-colors hover:border-emerald hover:text-emerald"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
