"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatedText } from "@/components/AnimatedText";
import { Button } from "@/components/Button";
import { FlightSearch } from "@/components/FlightSearch";
import { SectionReveal } from "@/components/SectionReveal";
import { HERO_IMAGE } from "@/data/content";

export interface HeroProps {
  headingLines?: string[];
  subheading?: string;
  imageSrc?: string;
  primaryButtonLabel?: string;
  primaryButtonHref?: string;
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;
}

/** All props optional, each falling back to the current hardcoded default —
 * `<Hero />` with no props renders identically to before this became
 * DB-drivable, so a missing/unpublished section row (or the DB being
 * unreachable) never breaks the homepage. */
export function Hero({
  headingLines = ["Complex International", "Travel, Made Easier."],
  subheading = "Business Class, First Class, Premium Economy, and complex multi-city journeys, planned around the way you travel.",
  imageSrc,
  primaryButtonLabel = "Speak With a Travel Specialist",
  primaryButtonHref = "#destinations",
  secondaryButtonLabel = "Submit a Travel Enquiry",
  secondaryButtonHref = "#connect",
}: HeroProps = {}) {
  // The image always renders as the base layer — instant paint, and the
  // permanent fallback if `public/video/hero.mp4` hasn't been added yet
  // (or fails to load). The video, when present, plays on top of it and
  // is removed from the DOM on error rather than left as a broken/black
  // element, revealing the still image underneath exactly as before.
  const [videoFailed, setVideoFailed] = useState(false);

  // A DB-provided `imageSrc` is always a plain string; the built-in default
  // (`HERO_IMAGE.src`) can still be a local `StaticImageData` import.
  const resolvedImageSrc = imageSrc ?? HERO_IMAGE.src;

  // `<video poster>` is a plain HTML attribute — it only accepts a string
  // URL, unlike `next/image`'s `src` (which also accepts the StaticImageData
  // object a local `import` produces), so it needs unwrapping here.
  const heroPosterSrc = typeof resolvedImageSrc === "string" ? resolvedImageSrc : resolvedImageSrc.src;

  return (
    <section
      id="flights"
      className="relative flex min-h-[650px] items-center overflow-hidden bg-navy-deep pb-16 pt-32 sm:min-h-[700px] lg:min-h-[750px] lg:pt-24"
    >
      <Image src={resolvedImageSrc} alt={HERO_IMAGE.alt} fill priority sizes="100vw" className="object-cover" />
      {!videoFailed ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroPosterSrc}
          onError={() => setVideoFailed(true)}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/40 to-navy-deep/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />

      <div className="content-container relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          {/* <SectionReveal>
            <span className="eyebrow">Premium International Travel</span>
          </SectionReveal> */}

          <AnimatedText
            as="h1"
            text={headingLines}
            mode="line"
            className="mt-4 text-2xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[40px]"
          />

          <SectionReveal delay={0.3}>
            <p
              className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg"
              dangerouslySetInnerHTML={{ __html: subheading }}
            />
          </SectionReveal>

          <SectionReveal delay={0.45}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={primaryButtonHref} variant="primary">
                {primaryButtonLabel}
              </Button>
              <Button
                href={secondaryButtonHref}
                variant="secondary"
                className="hover:brightness-110"
                style={{ backgroundColor: "#40a8f3", borderColor: "#40a8f3" }}
              >
                {secondaryButtonLabel}
              </Button>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal scale={0.95} delay={0.2} className="lg:justify-self-end lg:w-full">
          <FlightSearch />
        </SectionReveal>
      </div>
    </section>
  );
}
