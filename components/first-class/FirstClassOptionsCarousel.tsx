"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

export interface FirstClassOptionCard {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

const DEFAULT_CARDS: FirstClassOptionCard[] = [
  {
    id: "long-haul-overnight",
    title: "Long-Haul Overnight Travel",
    description: "On overnight routes, a lie-flat suite, privacy and real sleep can matter more than any other factor.",
    image: unsplash("1587019158091-1a103c5dd17f"),
    alt: "A commercial aircraft on final approach against a blue sky",
  },
  {
    id: "honeymoons-anniversaries",
    title: "Honeymoons & Anniversaries",
    description: "For a once-in-a-while trip, the extra privacy and service of First Class can shape the whole journey.",
    image: unsplash("1533929736458-ca588d08c8be"),
    alt: "Tower Bridge over the River Thames in London",
  },
  {
    id: "executive-travel",
    title: "Executive Travel",
    description: "Rest, connectivity and flexibility before an important meeting are often worth planning around.",
    image: unsplash("1600880292203-757bb62b4baf"),
    alt: "Two business travelers celebrating a successful meeting",
  },
];

export interface FirstClassOptionsCarouselProps {
  heading?: string;
  subheading?: string;
  cards?: FirstClassOptionCard[];
}

/** A sliding carousel variant of `FlightOptionCards`' card style (see
 * `components/multi-city/FlightOptionCards.tsx`) — this section's reference
 * design shows the same image-top/gray-band card navigated with arrows
 * rather than laid out as a static grid, so it gets its own small carousel
 * wrapper instead of forcing that component into two different layouts.
 * All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function FirstClassOptionsCarousel({
  heading = "When Is First Class the Right Choice?",
  subheading = "First Class can offer an exceptional long-haul experience, but it isn't automatically the best option for every journey. We help you consider the complete trip before deciding which cabin makes sense.",
  cards = DEFAULT_CARDS,
}: FirstClassOptionsCarouselProps = {}) {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="relative mt-12 px-9 sm:px-11">
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: ".fc-options-prev", nextEl: ".fc-options-next" }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {cards.map((card) => (
              <SwiperSlide key={card.id} className="h-auto">
                <article className="h-full overflow-hidden rounded-card shadow-card">
                  <div className="relative aspect-[16/11] w-full">
                    <Image src={card.image} alt={card.alt} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
                  </div>
                  <div className="bg-gray-light p-5">
                    <h3 className="text-lg text-text-dark">{card.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-text-gray">{card.description}</p>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous"
            className="fc-options-prev absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="fc-options-next absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
