"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { BUSINESS_CLASS_IMAGES } from "@/data/content";

const DEFAULT_HEADING = "Find the Right Business Class Flight for Your Journey";
const DEFAULT_BODY =
  "Business Class should be about more than simply getting from one destination to another. " +
  "Whether you're travelling for business, marking a special occasion or simply want greater comfort on a " +
  "long-haul journey, we help you explore Business Class options that fit your journey. We look beyond the " +
  "headline fare to consider the details that can make a significant difference to your experience — " +
  "including airline, routing, connection times, departure and arrival airports, fare flexibility and overall " +
  "journey comfort. Because the best Business Class itinerary isn't necessarily the most expensive one. It's " +
  "the one that makes sense for you.";

export interface BusinessClassSectionProps {
  heading?: string;
  body?: string;
  images?: { src: string; alt: string }[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. The heading previously forced a manual line
 * break after "Class" — dropped so the text stays freely editable; natural
 * wrapping still gives ~2 lines at this width. */
export function BusinessClassSection({
  heading = DEFAULT_HEADING,
  body = DEFAULT_BODY,
  images = BUSINESS_CLASS_IMAGES,
}: BusinessClassSectionProps = {}) {
  return (
    // `overflow-x-hidden`: the image/text below slide in via translateX —
    // clips that motion at the section boundary so it can never cause
    // page-level horizontal scroll if the reveal hasn't settled yet
    // (e.g. a fast scroll flick past the trigger point).
    <section id="business-class" className="overflow-x-hidden bg-white py-14 sm:py-16 mt-10">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-80}>
          <div className="relative h-[320px] overflow-hidden shadow-card sm:h-[420px] lg:h-[480px]">
            <Swiper
              modules={[Autoplay, EffectFade, Navigation, Pagination]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ el: ".business-class-pagination", clickable: true }}
              navigation={{ prevEl: ".business-class-prev", nextEl: ".business-class-next" }}
              loop
              className="h-full w-full"
            >
              {images.map((image) => (
                <SwiperSlide key={image.src}>
                  <div className="relative h-full w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div
              className="business-class-pagination absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-1.5 [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:w-1.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:w-5"
              style={
                {
                  // Swiper's base stylesheet sets bullet colors from these
                  // CSS custom properties (falling back to its own blue
                  // theme color) — overriding them here beats fighting the
                  // cascade against a descendant-selector utility class,
                  // since Swiper's own rule always reads the variable first.
                  "--swiper-pagination-color": "#ffffff",
                  "--swiper-pagination-bullet-inactive-color": "#ffffff",
                  "--swiper-pagination-bullet-inactive-opacity": "0.5",
                } as CSSProperties
              }
            />

            <div className="absolute right-0 top-0 z-20 w-20 h-20 flex items-center gap-0  bg-[#f4f4f4] p-1 shadow-card">
              <button
                type="button"
                aria-label="Previous image"
                className="business-class-prev flex items-center justify-center  text-navy-deep transition-colors hover:bg-gray-light"
              >
                <ChevronLeft size={30} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                className="business-class-next flex  items-center justify-center  text-navy-deep transition-colors hover:bg-gray-light"
              >
                <ChevronRight size={30} aria-hidden="true" />
              </button>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal x={80} delay={0.1}>
          <h2 className="mt-3 text-2xl text-[#0a0c11] sm:text-4xl lg:text-[30px]">{heading}</h2>
          <div className="mt-5 max-w-lg text-[16px] text-[#7e7e7e]" dangerouslySetInnerHTML={{ __html: body }} />
          <div className="mt-8" />
        </SectionReveal>
      </div>
    </section>
  );
}
