"use client";

import type { CSSProperties } from "react";
import { useId } from "react";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";

export interface ImageTextBlockProps {
  eyebrowLines: string[];
  body: string;
  images: { src: string; alt: string }[];
  imagePosition?: "left" | "right";
  benefits?: string[];
  /** A plain two-column list (no checkmark bullets) — an alternative to
   * `benefits` (a single checkmarked column) for content that reads as two
   * side-by-side columns of short phrases in the reference design (e.g.
   * "Flexible fares" / "Mixed-cabin itineraries"). At most one of
   * `benefits`/`twoColumnItems` is expected to be set at a time. */
  twoColumnItems?: string[][];
  /** A third, richer list style alongside `benefits`/`twoColumnItems` — a
   * two-column grid of title+description pairs rather than plain bullet
   * phrases, for content that reads as a short set of labelled process
   * steps (e.g. the Flight Change page's "How Our Flight Change Assistance
   * Works"). At most one of the three list props is expected to be set at
   * a time. */
  titledItems?: { title: string; description: string }[];
  buttonLabel?: string;
  buttonHref?: string;
  /** Defaults to "navy" (every existing caller's current look). The First
   * Class page's "Tell Us What You Want" block uses "gold" instead, to
   * match a CTA that reads as more of a primary action there than the
   * navy buttons elsewhere on that same page. */
  buttonVariant?: "navy" | "gold";
}

/** Shared "large image + text" layout behind both One-Way/Multi-City
 * blocks (`BusinessClassOptions`) and the journey block (`JourneySection`)
 * on the Business Class page — its own component, deliberately not the
 * homepage's `BusinessClassSection`/`PersonalizedJourney` (this page wants
 * a similarly-styled section, not a literal reuse of homepage-specific
 * component instances). The image carousel below borrows the same visual
 * language those homepage sections use (crossfade, autoplay, pagination,
 * arrow box) as its own independent implementation, not an import. Each
 * instance gets a unique id so two blocks on the same page never wire
 * their pagination/nav clicks into each other's carousel. */
export function ImageTextBlock({
  eyebrowLines,
  body,
  images,
  imagePosition = "left",
  benefits,
  twoColumnItems,
  titledItems,
  buttonLabel,
  buttonHref,
  buttonVariant = "navy",
}: ImageTextBlockProps) {
  const instanceId = useId().replace(/:/g, "");
  const prevClass = `image-text-block-prev-${instanceId}`;
  const nextClass = `image-text-block-next-${instanceId}`;
  const paginationClass = `image-text-block-pagination-${instanceId}`;
  // A single static image (e.g. the "planning CTA" block, which never had
  // more than one photo in the reference design) shows no carousel chrome
  // at all — the arrow box and pagination dots only make sense once
  // there's something to navigate between.
  const isCarousel = images.length > 1;

  const imageBlock = (
    <SectionReveal x={imagePosition === "left" ? -60 : 60}>
      <div className="relative h-[320px] overflow-hidden  shadow-card sm:h-[420px] lg:h-[480px]">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={isCarousel ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
          pagination={isCarousel ? { el: `.${paginationClass}`, clickable: true } : false}
          navigation={isCarousel ? { prevEl: `.${prevClass}`, nextEl: `.${nextClass}` } : false}
          loop={images.length > 1}
          className="h-full w-full"
        >
          {images.map((image) => (
            <SwiperSlide key={image.src}>
              <div className="relative h-full w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {isCarousel ? (
          <>
            <div
              className={`${paginationClass} absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-1.5 [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:w-1.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:w-5`}
              style={
                {
                  "--swiper-pagination-color": "#ffffff",
                  "--swiper-pagination-bullet-inactive-color": "#ffffff",
                  "--swiper-pagination-bullet-inactive-opacity": "0.5",
                } as CSSProperties
              }
            />

            <div
              className={`absolute bottom-0 z-20 flex h-20 w-20 items-center gap-0 bg-[#f4f4f4] p-1 shadow-card ${
                imagePosition === "left" ? "right-0" : "left-0"
              }`}
            >
              <button
                type="button"
                aria-label="Previous image"
                className={`${prevClass} flex items-center justify-center text-navy-deep transition-colors hover:bg-gray-light`}
              >
                <ChevronLeft size={30} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                className={`${nextClass} flex items-center justify-center text-navy-deep transition-colors hover:bg-gray-light`}
              >
                <ChevronRight size={30} aria-hidden="true" />
              </button>
            </div>
          </>
        ) : null}
      </div>
    </SectionReveal>
  );

  const textBlock = (
    <SectionReveal x={imagePosition === "left" ? 60 : -60} delay={0.1}>
      <h3 className="text-2xl leading-tight text-text-dark sm:text-[30px]">
        {eyebrowLines.map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))}
      </h3>
      <p className="mt-5 max-w-lg text-[16px] text-text-gray">{body}</p>

      {benefits && benefits.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-[15px] text-text-dark">
              <Check size={18} className="mt-0.5 shrink-0 text-emerald" aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>
      ) : null}

      {twoColumnItems && twoColumnItems.length > 0 ? (
        <div className="mt-6 grid max-w-lg grid-cols-2 gap-x-8 gap-y-2.5">
          {twoColumnItems.map((column, columnIndex) => (
            <ul key={columnIndex} className="space-y-2.5">
              {column.map((item) => (
                <li key={item} className="text-[15px] text-text-dark">
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      ) : null}

      {titledItems && titledItems.length > 0 ? (
        <div className="mt-6 grid max-w-lg grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {titledItems.map((item) => (
            <div key={item.title}>
              <h4 className="text-[16px] font-semibold text-text-dark">{item.title}</h4>
              <p className="mt-1.5 text-[14px] leading-relaxed text-text-gray">{item.description}</p>
            </div>
          ))}
        </div>
      ) : null}

      {buttonLabel && buttonHref ? (
        <div className="mt-8">
          <Button href={buttonHref} variant={buttonVariant}>
            {buttonLabel}
          </Button>
        </div>
      ) : null}
    </SectionReveal>
  );

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
      {imagePosition === "left" ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </div>
  );
}
