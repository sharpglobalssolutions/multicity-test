import Image from "next/image";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

const DEFAULT_PARAGRAPHS = [
  "Multi-city travel involves more than connecting several flights. Your destinations, dates, airlines, routing and fare conditions can all affect the journey.",
  "With 11+ years of travel industry experience, we help you explore practical ways to structure your European trip.",
];

const DEFAULT_TAGS = ["11+ Years Experience", "International Routes", "Multi-City Expertise"];

export interface ExpertGuidanceSectionProps {
  heading?: string;
  paragraphs?: string[];
  tags?: string[];
  buttonLabel?: string;
  buttonHref?: string;
  imageSrc?: string;
  /** Defaults to "right" (Multi-City Flights' current layout, unchanged).
   * The First Class page's reference design mirrors this — image on the
   * left, text on the right — so it passes "left" instead. */
  imagePosition?: "left" | "right";
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function ExpertGuidanceSection({
  heading = "Expert Guidance for Multi-City International Travel",
  paragraphs = DEFAULT_PARAGRAPHS,
  tags = DEFAULT_TAGS,
  buttonLabel = "Speak With a Multi-City Specialist",
  buttonHref = "#connect",
  imageSrc = unsplash("1714079761488-e0c9b9ac4138"),
  imagePosition = "right",
}: ExpertGuidanceSectionProps = {}) {
  const textBlock = (
    <SectionReveal x={imagePosition === "right" ? -60 : 60}>
      <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px] font-semibold">{heading}</h2>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={`max-w-lg text-[16px] leading-relaxed text-text-gray ${index === 0 ? "mt-5" : "mt-4"}`}>
          {paragraph}
        </p>
      ))}

      {tags.length > 0 ? (
        <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-gray">
          {tags.map((tag, index) => (
            <span key={tag} className="flex items-center gap-2">
              {index > 0 ? <span className="size-1 rounded-full bg-text-gray/50" aria-hidden="true" /> : null}
              {tag}
            </span>
          ))}
        </p>
      ) : null}

      <div className="mt-8">
        <Button href={buttonHref} variant="navy">
          {buttonLabel}
        </Button>
      </div>
    </SectionReveal>
  );

  const imageBlock = (
    <SectionReveal x={imagePosition === "right" ? 60 : -60} delay={0.1}>
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
        <Image
          src={imageSrc}
          alt="A travel specialist assisting a client over a headset"
          fill
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover rounded rounded-4xl"
        />
      </div>
    </SectionReveal>
  );

  return (
    <section className="overflow-x-hidden bg-white py-10 sm:py-14">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {imagePosition === "right" ? (
          <>
            {textBlock}
            {imageBlock}
          </>
        ) : (
          <>
            {imageBlock}
            {textBlock}
          </>
        )}
      </div>
    </section>
  );
}
