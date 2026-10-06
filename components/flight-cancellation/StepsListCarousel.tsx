"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";

export interface StepsListCarouselStep {
  id: string;
  stepLabel: string;
  /** Newline-separated — see `CnxStepsCarouselSectionData` in
   * `types/page-sections.ts` for why a plain bullet list is stored as one
   * string rather than a real array. */
  items: string;
}

const DEFAULT_STEPS: StepsListCarouselStep[] = [
  { id: "step-1", stepLabel: "Step 1", items: "Airline\nBooking Reference\nDeparture Airport\nDestination\nTravel Date\nCabin Class" },
  {
    id: "step-2",
    stepLabel: "Step 2",
    items: "Family emergency\nBusiness schedule\nMedical issue\nVisa issue\nAirline schedule change\nTravel restrictions\nChange of plans\nOther",
  },
  {
    id: "step-3",
    stepLabel: "Step 3",
    items: "Cancel entire booking\nChange travel dates\nRebook another flight\nReview refund eligibility\nTravel credit\nCancel one passenger\nCancel one segment\nNot sure",
  },
];

export interface StepsListCarouselProps {
  heading?: string;
  subheading?: string;
  steps?: StepsListCarouselStep[];
}

/** A swiper carousel of solid, left-aligned "Step N" cards — distinct from
 * `WhyChooseSection`'s `cardStyle="bordered"` pill cards (centered
 * title/paragraph) and `HowItWorksCarousel`'s icon cards; this one is a
 * dense checklist per step, so its own component rather than overloading
 * either of those with a third visual mode. All props optional, falling
 * back to the current hardcoded default — see `Hero.tsx` for the
 * rationale. */
export function StepsListCarousel({
  heading = "Let's Review Your Flight Cancellation Options",
  subheading = "Tell us what changed and share whatever you know about your booking. You don't need to understand the fare rules before contacting us.",
  steps = DEFAULT_STEPS,
}: StepsListCarouselProps = {}) {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="relative mt-12 px-10 sm:px-12">
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: ".steps-list-prev", nextEl: ".steps-list-next" }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {steps.map((step) => (
              <SwiperSlide key={step.id} className="h-auto">
                <div className="h-full rounded-2xl bg-navy-deep p-7">
                  <h3 className="text-xl text-white">{step.stepLabel}</h3>
                  <ul className="mt-4 space-y-2">
                    {step.items
                      .split("\n")
                      .filter(Boolean)
                      .map((item) => (
                        <li key={item} className="text-[14px] leading-relaxed text-white/80">
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous"
            className="steps-list-prev absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 text-navy-deep transition-colors hover:border-emerald hover:text-emerald"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="steps-list-next absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 text-navy-deep transition-colors hover:border-emerald hover:text-emerald"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
