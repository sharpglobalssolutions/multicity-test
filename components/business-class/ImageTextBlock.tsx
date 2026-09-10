import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";

export interface ImageTextBlockProps {
  eyebrowLines: string[];
  body: string;
  image: { src: string; alt: string };
  imagePosition?: "left" | "right";
  benefits?: string[];
  buttonLabel?: string;
  buttonHref?: string;
}

/** Shared "large image + text" layout behind both One-Way/Multi-City
 * blocks (`BusinessClassOptions`) and the journey block (`JourneySection`)
 * on the Business Class page — a local primitive rather than reusing the
 * homepage's `BusinessClassSection`/`PersonalizedJourney`, which are
 * already tuned for the homepage's own carousel-image content and don't
 * need this page's extra benefits-list/CTA options grafted on. */
export function ImageTextBlock({
  eyebrowLines,
  body,
  image,
  imagePosition = "left",
  benefits,
  buttonLabel,
  buttonHref,
}: ImageTextBlockProps) {
  const imageBlock = (
    <SectionReveal x={imagePosition === "left" ? -60 : 60}>
      <div className="relative h-[320px] overflow-hidden rounded-card shadow-card sm:h-[420px] lg:h-[480px]">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
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

      {buttonLabel && buttonHref ? (
        <div className="mt-8">
          <Button href={buttonHref} variant="primary">
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
