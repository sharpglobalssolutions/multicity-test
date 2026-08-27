"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Globe2, Plane } from "lucide-react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";
import { TESTIMONIALS, type Testimonial } from "@/data/content";

export interface TestimonialCarouselProps {
  heading?: string;
  subheading?: string;
  testimonials?: Testimonial[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function TestimonialCarousel({
  heading = "Client Experiences",
  subheading = "Trusted by travelers worldwide.",
  testimonials = TESTIMONIALS,
}: TestimonialCarouselProps = {}) {
  return (
    <section id="testimonials" className="relative overflow-hidden bg-white py-20 sm:py-20">
      {/* Decorative, low-opacity travel motif — not a stock photo, just the
          site's own icon set (globe + plane) rendered oversized so it reads
          as a background illustration without competing with the cards. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]"
      >
        <Globe2 size={620} strokeWidth={0.6} className="text-navy-deep" />
        <Plane size={160} strokeWidth={0.6} className="absolute left-[60%] top-[20%] -rotate-45 text-navy-deep" />
      </div>

      <div className="content-container relative">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="mt-3 text-3xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-2 text-base text-text-gray sm:text-[16px]">{subheading}</p>
        </SectionReveal>

        <SectionReveal delay={0.15} className="relative mx-auto mt-12 px-10 sm:px-14">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: ".testimonials-prev", nextEl: ".testimonials-next" }}
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop
            spaceBetween={28}
            slidesPerView={1}
            breakpoints={{ 1024: { slidesPerView: 2, spaceBetween: 32 } }}
            className="testimonial-swiper overflow-hidden! pt-12! sm:pt-14!"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto relative">
                <figure className="relative flex h-full flex-col items-center rounded-card bg-gray-light px-8 pb-10 pt-8 text-center sm:px-12 sm:pb-12 sm:pt-10">
                  {/* The visible ink of a "“" glyph sits high in its own
                      line-box (this font's cap-height area, not vertically
                      centered) — a plain -50% translate centers the box, not
                      the ink, leaving the mark almost entirely above the
                      card. -21% is tuned to the actual glyph so the drawn
                      mark itself straddles the card's top edge evenly. */}
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-[27%] font-heading text-7xl font-black leading-none text-text-dark sm:text-8xl"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-2 max-w-md text-base leading-relaxed text-text-dark sm:text-lg">
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-8 flex flex-col items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.avatar}
                        alt={`Portrait of ${testimonial.name}`}
                        fill
                        sizes="56px"
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
            className="testimonials-prev absolute left-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center p-2 text-text-dark transition-opacity hover:opacity-60"
          >
            <ChevronLeft size={30} strokeWidth={2.25} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            className="testimonials-next absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center p-2 text-text-dark transition-opacity hover:opacity-60"
          >
            <ChevronRight size={30} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
