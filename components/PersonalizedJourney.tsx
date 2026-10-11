"use client";

import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { PERSONALIZED_JOURNEY_IMAGES } from "@/data/content";

const DEFAULT_HEADING = "Get Expert Help With Complex International Itineraries";
const DEFAULT_BODY =
  "Some journeys are straightforward. Others require a little more thought. Multiple destinations. " +
  "Long-haul connections. Premium cabins. Different departure airports. Tight schedules. Flexible travel " +
  "dates. Open-jaw or multi-city itineraries. When there are more moving parts, finding the right " +
  "combination can become considerably more difficult than simply searching for a flight. That's where a " +
  "travel specialist can make a difference. At MultiCity Experts, we provide personalised assistance for " +
  "complex international travel, helping you evaluate the options that best fit your journey.";

export interface PersonalizedJourneyProps {
  heading?: string;
  body?: string;
  images?: { src: string; alt: string }[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function PersonalizedJourney({
  heading = DEFAULT_HEADING,
  body = DEFAULT_BODY,
  images = PERSONALIZED_JOURNEY_IMAGES,
}: PersonalizedJourneyProps = {}) {
  // A fade-effect Swiper keeps every slide stacked at the same position
  // (only `opacity` differs), so the browser considers them all "in
  // viewport" at once — `next/image`'s own lazy loading can't defer them,
  // and all N images would otherwise fetch simultaneously on mount,
  // starving the one the visitor actually sees first. Loading only the
  // active slide (plus the one it's about to crossfade to) spreads the
  // requests out to match what autoplay actually shows.
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(() => new Set([0, 1 % images.length]));
  // `loop: true` makes Swiper reposition to an internal clone right after
  // mount, which fires `onSlideChangeTransitionStart` once as its own
  // bookkeeping — not a real user-visible transition. Skipping exactly
  // that first firing (whenever it happens — no timing assumed) keeps the
  // initial load to the two slides above; every firing after it is a
  // genuine autoplay/user transition.
  const skippedInitialTransitionRef = useRef(false);

  return (
    // overflow-x-hidden: see BusinessClassSection — clips the image's
    // translateX reveal so it can never cause page-level horizontal scroll.
    <section className="overflow-x-hidden bg-white py-10 sm:py-12 personalize-journey">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal y={24}>
          <h2 className="mt-3 text-2xl font-semibold text-[#0a0c11] sm:text-4xl lg:text-[30px]">{heading}</h2>
          <div className="mt-5 max-w-lg text-[16px] text-[#7e7e7e]" dangerouslySetInnerHTML={{ __html: body }} />
        </SectionReveal>

        <SectionReveal x={80} delay={0.1}>
          <div className="relative h-[320px] overflow-hidden shadow-card sm:h-[420px] lg:h-[480px]">
            <Swiper
              modules={[Autoplay, EffectFade, Navigation, Pagination]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ el: ".personalized-journey-pagination", clickable: true }}
              navigation={{ prevEl: ".personalized-journey-prev", nextEl: ".personalized-journey-next" }}
              loop={images.length > 1}
              className="h-full w-full"
              onSlideChangeTransitionStart={(swiper) => {
                if (!skippedInitialTransitionRef.current) {
                  skippedInitialTransitionRef.current = true;
                  return;
                }
                const next = (swiper.realIndex + 1) % images.length;
                setLoadedIndices((prev) => {
                  if (prev.has(swiper.realIndex) && prev.has(next)) return prev;
                  return new Set(prev).add(swiper.realIndex).add(next);
                });
              }}
            >
              {images.map((image, index) => (
                <SwiperSlide key={image.src}>
                  <div className="relative h-full w-full">
                    {loadedIndices.has(index) ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 45vw, 90vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    ) : null}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div
              className="personalized-journey-pagination absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-1.5 [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:w-1.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:w-5"
              style={
                {
                  "--swiper-pagination-color": "#ffffff",
                  "--swiper-pagination-bullet-inactive-color": "#ffffff",
                  "--swiper-pagination-bullet-inactive-opacity": "0.5",
                } as CSSProperties
              }
            />

                <div className="absolute left-0 top-0 z-20 w-20 h-20 flex items-center gap-0  bg-[#f4f4f4] p-1 shadow-card">
              <button
                type="button"
                aria-label="Previous image"
                className="personalized-journey-prev flex items-center justify-center  text-navy-deep transition-colors hover:bg-gray-light"
              >
                <ChevronLeft size={30} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                className="personalized-journey-next flex  items-center justify-center  text-navy-deep transition-colors hover:bg-gray-light"
              >
                <ChevronRight size={30} aria-hidden="true" />
              </button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
