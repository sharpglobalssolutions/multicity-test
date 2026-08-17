"use client";

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";
import { DEALS } from "@/data/content";

export function DestinationCarousel() {
  return (
    <section id="destinations" className="bg-white py-20 sm:py-28">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Curated Routes</span>
          <h2 className="mt-3 text-3xl font-bold text-text-dark sm:text-4xl lg:text-[42px]">
            Best-Selling Business Class Flight Deals
          </h2>
          <p className="mt-4 text-base text-text-gray sm:text-lg">Exceptional routes. Exceptional value.</p>
        </SectionReveal>

        <SectionReveal delay={0.15} className="relative mt-12">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: ".deals-prev", nextEl: ".deals-next" }}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop
            spaceBetween={20}
            slidesPerView={1.15}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="overflow-hidden!"
          >
            {DEALS.map((deal) => (
              <SwiperSlide key={deal.id}>
                <article className="group relative h-[380px] overflow-hidden rounded-card bg-navy-deep shadow-card">
                  <Image
                    src={deal.image}
                    alt={deal.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-xl font-bold text-white">{deal.city}</h3>
                    <p className="mt-1 text-sm text-white/75">{deal.route}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-emerald-bright">{deal.price}</span>
                      <a
                        href="#connect"
                        className="flex items-center gap-1 text-sm font-semibold text-white transition-colors hover:text-emerald-bright"
                      >
                        Get Deal
                        <ArrowRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous destination"
            className="deals-prev absolute left-0 top-1/2 z-10 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white p-3 text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald sm:flex"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next destination"
            className="deals-next absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-navy-deep/10 bg-white p-3 text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald sm:flex"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
