"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";
import { WHO_WE_HELP_CARDS } from "@/data/about-content";

export function AboutWhoWeHelp() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">Who We Help</h2>
        </SectionReveal>

        <SectionReveal delay={0.15} className="relative mt-12 px-9 sm:px-11">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: ".who-we-help-prev", nextEl: ".who-we-help-next" }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            spaceBetween={24}
            slidesPerView={1.1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 2, spaceBetween: 32 },
            }}
            className="overflow-hidden!"
          >
            {WHO_WE_HELP_CARDS.map((card) => (
              <SwiperSlide key={card.id}>
                <article className="group text-center transition-transform duration-300 hover:-translate-y-1.5">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      loading="eager"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <h3 className="relative mt-4 inline-block text-center text-lg font-semibold text-text-dark after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-emerald after:transition-all after:duration-300 group-hover:after:w-full">
                    {card.title}
                  </h3>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous"
            className="who-we-help-prev absolute left-0 top-[42%] z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="who-we-help-next absolute right-0 top-[42%] z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
