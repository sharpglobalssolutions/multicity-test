"use client";

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

export interface FirstClassAirline {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  linkLabel: string;
  linkHref: string;
}

const DEFAULT_AIRLINES: FirstClassAirline[] = [
  {
    id: "british-airways",
    title: "British Airways First Class",
    description: "Comfortable long-haul travel with premium service and better space.",
    image: unsplash("1569629743817-70d8db6c323b"),
    alt: "A wide-body aircraft on final approach against a blue sky",
    linkLabel: "Explore First Class",
    linkHref: "#connect",
  },
  {
    id: "lufthansa",
    title: "Lufthansa First Class",
    description: "Privacy, space and an elevated experience from the airport to your destination.",
    image: unsplash("1587019158091-1a103c5dd17f"),
    alt: "A commercial aircraft on final approach against a blue sky",
    linkLabel: "Explore First Class",
    linkHref: "#connect",
  },
  {
    id: "air-france",
    title: "Air France La Première",
    description: "Multiple destinations and complicated routes made easier with expert planning.",
    image: unsplash("1474302770737-173ee21bab63"),
    alt: "A commercial aircraft climbing into a golden evening sky",
    linkLabel: "Plan My Journey",
    linkHref: "#connect",
  },
  {
    id: "american-airlines",
    title: "American Airlines First",
    description: "Multiple destinations and complicated routes made easier with expert planning.",
    image: unsplash("1436491865332-7a61a109cc05"),
    alt: "An aircraft wing above the clouds during a sunset flight",
    linkLabel: "Plan My Journey",
    linkHref: "#connect",
  },
];

export interface FirstClassAirlinesCarouselProps {
  heading?: string;
  subheading?: string;
  airlines?: FirstClassAirline[];
}

/** A card carousel comparing First Class products across airlines — same
 * faint world-map backdrop as `BusinessClassExpertise` (see
 * `components/business-class/BusinessClassExpertise.tsx`), its own
 * independent content rather than a literal reuse of that component. All
 * props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function FirstClassAirlinesCarousel({
  heading = "Compare First Class Airlines & Cabin Experiences",
  subheading = "First Class is not a standardised product. Two airlines can offer very different experiences, even when both use the First Class name.",
  airlines = DEFAULT_AIRLINES,
}: FirstClassAirlinesCarouselProps = {}) {
  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-14">
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
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="relative mt-10 px-9 sm:px-11">
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl: ".fc-airlines-prev", nextEl: ".fc-airlines-next" }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
          >
            {airlines.map((airline) => (
              <SwiperSlide key={airline.id} className="h-auto">
                <article className="h-full rounded-card bg-gray-light p-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px]">
                    <Image src={airline.image} alt={airline.alt} fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold text-text-dark">{airline.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-text-gray">{airline.description}</p>
                  <a
                    href={airline.linkHref}
                    className="mt-3 flex items-center justify-between text-[13px] font-semibold text-emerald"
                  >
                    {airline.linkLabel}
                    <span className="flex size-7 items-center justify-center rounded-full bg-navy-deep text-white">
                      <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </a>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            aria-label="Previous"
            className="fc-airlines-prev absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="fc-airlines-next absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy-deep/10 bg-white text-navy-deep shadow-card transition-colors hover:border-emerald hover:text-emerald"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
