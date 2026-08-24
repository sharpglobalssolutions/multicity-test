"use client";

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";
import { SERVICES } from "@/data/content";

/**
 * Six services now (up from the original three) specifically so `loop`
 * can be enabled below — Swiper needs roughly double the visible count
 * (3 per view on desktop) to loop cleanly without duplicate-slide
 * artifacts, which the original three-service, show-all-at-once layout
 * couldn't satisfy.
 */
export function ServicesCarousel() {
  return (
    <section id="services" className="relative overflow-hidden bg-white py-20 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]"
        style={{
          backgroundImage: "url('/images/map.webp')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "min(1400px, 160%) auto",
        }}
      />

      <div className="content-container relative">
        <SectionReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl text-text-dark sm:text-4xl lg:text-[30px]">
            International Flight Services for Every Kind of Journey
          </h2>
          <p className="mt-2 text-base text-text-gray sm:text-[16px]">
            Every traveller has different priorities. That&apos;s why our services are designed to accommodate different types of international travel — from premium cabin journeys to complex multi-destination itineraries.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.15} className="relative mt-12">
          <Swiper
            modules={[Navigation, Autoplay, Keyboard]}
            navigation={{ prevEl: ".services-prev", nextEl: ".services-next" }}
            keyboard={{ enabled: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop
            spaceBetween={24}
            slidesPerView={1.1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 28 },
            }}
            className="overflow-hidden!"
          >
            {SERVICES.map((service) => (
              <SwiperSlide key={service.id}>
                <article className="group h-full rounded-card border border-navy-deep/8 bg-white shadow-card transition-transform duration-300 hover:-translate-y-1.5">
                  <div className="relative h-56 overflow-hidden rounded-t-card">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
           
                    <h3 className="mt-2 text-[18px] font-semibold text-text-dark">{service.title}</h3>
                    <p className="mt-2 text-[15px] leading-normal text-text-gray">{service.description}</p>
                    <a
                      href={service.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-[16px]  text-emerald transition-colors hover:text-navy-deep"
                    >
                      Explore Business Class
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous service"
            className="services-prev absolute left-[-30px] top-1/2 z-10 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white p-3 text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald sm:flex"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next service"
            className="services-next absolute right-[-30px] top-1/2 z-10 hidden -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-navy-deep/10 bg-white p-3 text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald sm:flex"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
