"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

export interface JourneySlide {
  id: string;
  image: string;
  imageAlt: string;
  /** Newline-separated — see `HowItWorksStep` for why a slide's multi-line
   * title/factor list is stored as one string rather than a real array. */
  titleLines: string;
  description: string;
  factors: string;
}

const JOURNEY_FACTORS = "PRICE\nROUTING\nAIRLINE\nSCHEDULE\nFLEXIBILITY";

const DEFAULT_SLIDES: JourneySlide[] = [
  {
    id: "not-cheapest-fare",
    image: unsplash("1569154941061-e231b4725ef1"),
    imageAlt: "A passenger's premium business class seat and workspace in flight",
    titleLines: "Business Class is not\nAbout finding the\nCheapest fare",
    description: "It's about finding the right combination of price, routing, airline, schedule and flexibility.",
    factors: JOURNEY_FACTORS,
  },
  {
    id: "routing-and-connections",
    image: unsplash("1569629743817-70d8db6c323b"),
    imageAlt: "A wide-body aircraft on final approach against a blue sky",
    titleLines: "Routing And Connections\nShape How The\nJourney Feels",
    description:
      "A great itinerary considers layover times and connection quality, not just the number of stops along the way.",
    factors: JOURNEY_FACTORS,
  },
  {
    id: "flexibility-matters",
    image: unsplash("1500835556837-99ac94a94552"),
    imageAlt: "View from an aircraft window over clouds lit by a golden sunset",
    titleLines: "Flexibility Matters\nWhen Your Plans\nMight Change",
    description:
      "Fare rules vary widely, so we help you find options that let you adjust dates or routing without steep penalties.",
    factors: JOURNEY_FACTORS,
  },
];

export interface JourneyCarouselProps {
  slides?: JourneySlide[];
}

/** The image is a real Swiper carousel; the content panel isn't a second
 * Swiper instance kept in sync with it — an earlier attempt at that (via
 * Swiper's `Controller` module) hit a reproducible bug where the fade
 * transition got stuck at ~0 opacity on the last slide. Instead, the
 * image swiper's own slide-change index drives the content panel's React
 * state directly, cross-faded with framer-motion (already a dependency
 * here) — one source of truth, no second carousel instance to desync.
 *
 * All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function JourneyCarousel({ slides = DEFAULT_SLIDES }: JourneyCarouselProps = {}) {
  const instanceId = useId().replace(/:/g, "");
  const prevClass = `journey-carousel-prev-${instanceId}`;
  const nextClass = `journey-carousel-next-${instanceId}`;
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex] ?? slides[0]!;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="content-container grid grid-cols-1 items-center gap-11 md:grid-cols-[58%_1fr] md:gap-10 lg:gap-14">
        <SectionReveal x={-40}>
          <div className="relative h-[280px] w-full overflow-hidden sm:h-[360px] lg:h-[430px]">
            <Swiper
              modules={[Autoplay, EffectFade, Navigation]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={400}
              autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
              loop={slides.length > 1}
              onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
              className="h-full w-full"
            >
              {slides.map((s) => (
                <SwiperSlide key={s.id}>
                  <div className="relative h-full w-full">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 58vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="absolute bottom-0 right-0 z-20 flex h-11 w-[84px] items-center bg-[#EEEEEE]">
              <button
                type="button"
                aria-label="Previous slide"
                className={`${prevClass} flex h-full flex-1 items-center justify-center text-[#666666] transition-colors hover:bg-gray-light`}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                className={`${nextClass} flex h-full flex-1 items-center justify-center text-[#666666] transition-colors hover:bg-gray-light`}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal x={40} delay={0.1}>
          <div className="relative min-h-[270px] sm:min-h-[240px]">
            <AnimatePresence>
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <h2 className="text-[30px] leading-tight text-[#07111F] sm:text-[32px] md:text-[22px] lg:text-[34px]">
                  {slide.titleLines.split("\n").map((line, index) => (
                    <span key={index} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="mt-5 max-w-[430px] text-[16px] leading-relaxed text-[#999999]">{slide.description}</p>
                <ul className="mt-7 grid max-w-[420px] grid-cols-3 gap-x-6 gap-y-3">
                  {slide.factors.split("\n").map((factor) => (
                    <li key={factor} className="flex items-center gap-2 text-[15px] font-medium text-[#4a4a4a]">
                      <span className="size-1.5 shrink-0 rounded-full bg-[#B59655]" aria-hidden="true" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
