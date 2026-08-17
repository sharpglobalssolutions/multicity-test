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
 * `loop` is intentionally omitted here: there are exactly three fixed
 * services, all three show at once at the desktop breakpoint, and Swiper
 * needs roughly double the visible count to loop without visible
 * duplicate-slide artifacts — with this ratio it would either warn in
 * the console or misbehave. Drag/touch/keyboard/nav/autoplay all still
 * work; it just doesn't wrap back to the first slide after the last.
 */
export function ServicesCarousel() {
  return (
    <section id="services" className="bg-off-white py-20 sm:py-28">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-text-dark sm:text-4xl lg:text-[42px]">
            What Can We Help You With?
          </h2>
          <p className="mt-4 text-base text-text-gray sm:text-lg">
            From simple business trips to complex international journeys.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.15} className="relative mt-12">
          <Swiper
            modules={[Navigation, Autoplay, Keyboard]}
            navigation={{ prevEl: ".services-prev", nextEl: ".services-next" }}
            keyboard={{ enabled: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
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
                    <span className="eyebrow">{service.category}</span>
                    <h3 className="mt-2 text-xl font-bold text-text-dark">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-gray">{service.description}</p>
                    <a
                      href={service.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald transition-colors hover:text-navy-deep"
                    >
                      Learn More
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
            className="services-prev absolute left-0 top-1/2 z-10 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white p-3 text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald sm:flex"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next service"
            className="services-next absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-navy-deep/10 bg-white p-3 text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald sm:flex"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
