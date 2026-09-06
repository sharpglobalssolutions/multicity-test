"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SectionReveal } from "@/components/SectionReveal";
import { ROUTE_DEALS, type RouteDeal } from "@/data/content";

export interface RoutesCarouselProps {
  heading?: string;
  subheading?: string;
  routes?: RouteDeal[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function RoutesCarousel({
  heading = "Expert International Flight Planning Across Key Global Routes",
  subheading = "Whether you're travelling between major business centres, visiting family overseas, planning a multi-city holiday, or putting together a more complex itinerary, our specialists can help you evaluate the journey around your priorities.",
  routes = ROUTE_DEALS,
}: RoutesCarouselProps = {}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <div className="mt-4 text-base text-text-gray sm:text-[16px]" dangerouslySetInnerHTML={{ __html: subheading }} />
        </SectionReveal>

        <SectionReveal delay={0.15} className="mt-12">
          <div className="relative px-9 sm:px-11">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{ prevEl: ".routes-prev", nextEl: ".routes-next" }}
              pagination={{ el: ".routes-pagination", clickable: true }}
              autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 1.3, spaceBetween: 24 },
                1024: { slidesPerView: 2, spaceBetween: 28 },
              }}
              className="overflow-hidden!"
            >
              {routes.map((route) => (
                <SwiperSlide key={route.id} className="h-auto">
                  <article className="flex h-full min-h-[260px] overflow-hidden rounded-card border border-navy-deep/10 bg-white sm:min-h-[300px]">
                    <div className="relative w-2/5 shrink-0 sm:w-[38%]">
                      <Image
                        src={route.image}
                        alt={route.alt}
                        fill
                        loading="eager"
                        sizes="(min-width: 1024px) 22vw, 40vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="relative flex flex-1 flex-col justify-center gap-2.5 p-5 sm:p-6">
                      <Link
                        href={route.href}
                        aria-label={`View the ${route.originCity} to ${route.destinationCity} route`}
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-navy-deep/15 text-navy-deep transition-colors hover:border-navy-deep hover:bg-navy-deep hover:text-white"
                      >
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>

                      <span className="">Business Class</span>

                      <p className="flex items-center gap-2 text-[18px]  text-navy-deep">
                        {route.originCity}
                        <ArrowRight size={14} className="text-navy-deep/50" aria-hidden="true" />
                        {route.destinationCity}
                      </p>

                      <p className="text-sm text-text-gray">{route.multiCityRoute.join(" → ")}</p>

                      <p className="mt-1 text-[16px] text-text-gray">
                        Starting from <span className="text-[20px] ms-4 text-navy-deep">{route.price}</span>
                      </p>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              type="button"
              aria-label="Previous route"
              className="routes-prev absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next route"
              className="routes-next absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          <div
            className="routes-pagination mt-8 flex items-center justify-center gap-1.5 [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:w-1.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:w-5"
            style={
              {
                "--swiper-pagination-color": "#041627",
                "--swiper-pagination-bullet-inactive-color": "#041627",
                "--swiper-pagination-bullet-inactive-opacity": "0.2",
              } as CSSProperties
            }
          />
        </SectionReveal>
      </div>
    </section>
  );
}
