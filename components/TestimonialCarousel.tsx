"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";
import { TESTIMONIALS } from "@/data/content";

export function TestimonialCarousel() {
  return (
    <section id="testimonials" className="bg-off-white py-20 sm:py-28">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Testimonials</span>
          <h2 className="mt-3 text-3xl font-bold text-text-dark sm:text-4xl lg:text-[42px]">Client Experiences</h2>
          <p className="mt-4 text-base text-text-gray sm:text-lg">Trusted by travelers worldwide.</p>
        </SectionReveal>

        <SectionReveal delay={0.15} className="relative mt-12">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: ".testimonials-prev", nextEl: ".testimonials-next" }}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 1024: { slidesPerView: 2, spaceBetween: 28 } }}
            className="testimonial-swiper overflow-hidden!"
          >
            {TESTIMONIALS.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto">
                <figure className="flex h-full flex-col rounded-card border border-navy-deep/8 bg-white p-8 shadow-card">
                  <Quote className="text-emerald/30" size={40} aria-hidden="true" />
                  <blockquote className="mt-4 flex-1 text-base leading-relaxed text-text-dark sm:text-lg">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star key={i} size={14} className="fill-emerald text-emerald" aria-hidden="true" />
                    ))}
                  </div>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.avatar}
                        alt={`Portrait of ${testimonial.name}`}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-dark">{testimonial.name}</p>
                      <p className="text-xs text-text-gray">{testimonial.location}</p>
                    </div>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous testimonial"
            className="testimonials-prev absolute left-0 top-1/2 z-10 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white p-3 text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald sm:flex"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            className="testimonials-next absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-navy-deep/10 bg-white p-3 text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald sm:flex"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
