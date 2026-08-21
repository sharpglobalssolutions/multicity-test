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

export function BusinessClassSection() {
  return (
    // `overflow-x-hidden`: the image/text below slide in via translateX —
    // clips that motion at the section boundary so it can never cause
    // page-level horizontal scroll if the reveal hasn't settled yet
    // (e.g. a fast scroll flick past the trigger point).
    <section id="business-class" className="overflow-x-hidden bg-white py-14 sm:py-16">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-80}>
          <div className="group relative h-[320px] overflow-hidden rounded-card shadow-card sm:h-[420px] lg:h-[480px]">
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
              {BUSINESS_CLASS_IMAGES.map((image) => (
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

            <button
              type="button"
              aria-label="Previous image"
              className="business-class-prev absolute left-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-2 text-navy-deep opacity-0 shadow-card transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="business-class-next absolute right-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-2 text-navy-deep opacity-0 shadow-card transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </SectionReveal>

        <SectionReveal x={80} delay={0.1}>
          
          <h2 className="mt-3 text-2xl  text-text-dark sm:text-4xl lg:text-[30px]">
         Find the Right Business Class<br />Flight for Your Journey
          </h2>
          <p className="mt-5 max-w-lg text-[16px] text-text-gray">
           Business Class should be about more than simply getting from one destination to another.
Whether you're travelling for business, marking a special occasion or simply want greater comfort on a long-haul journey, we help you explore Business Class options that fit your journey.
We look beyond the headline fare to consider the details that can make a significant difference to your
experience — including airline, routing, connection times, departure and arrival airports, fare flexibility and overall journey comfort.
Because the best Business Class itinerary isn't necessarily the most expensive one. It's the one that makes sense for you.

          </p>
          <div className="mt-8">
         
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
