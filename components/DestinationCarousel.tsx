"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";
import { DEALS } from "@/data/content";

export function DestinationCarousel() {
  return (
    <section id="destinations" className="bg-white py-20 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="mt-3 text-3xl font-semibold text-text-dark sm:text-4xl lg:text-[30px]">
            Best-Selling Business Class Flight Deals
          </h2>
          <p className="mt-2 text-base text-text-gray sm:text-lg">
            Save 30-70%* OFF on Business Class Flights with Multi city experts.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.15} className="relative mt-12">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: ".deals-prev", nextEl: ".deals-next" }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 28 },
            }}
            className="overflow-hidden!"
          >
            {DEALS.map((deal) => (
              <SwiperSlide key={deal.id} className="h-auto">
                <article className="group flex h-full flex-col items-center text-center">
                  <div className="relative aspect-[4/5] w-full overflow-hidden  bg-navy-deep">
                    <Image
                      src={deal.image}
                      alt={deal.alt}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 90vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="exlusive-heal-content">
                    <p>Exclusive Deals {deal.city}</p>
                    <h3 className="mt-0 text-[24px] text-text-dark">
                      {deal.price}
                    </h3>
                    <a href="tel:1869-504-657">Call An Expert</a>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous destination"
            className="deals-prev absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white p-3 text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald sm:-left-4 sm:flex lg:-left-6"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next destination"
            className="deals-next absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white p-3 text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald sm:-right-4 sm:flex lg:-right-6"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
