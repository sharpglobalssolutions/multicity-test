import Image from "next/image";
import Link from "next/link";
import { SectionReveal } from "@/components/SectionReveal";
import { TRAVEL_ADVISOR_IMAGE } from "@/data/content";

const DEFAULT_PARAGRAPHS = [
  "Online flight searches can give you thousands of combinations in seconds. But more choice doesn't always mean a better choice. The real challenge is knowing which itinerary actually works for your journey.",
  "A travel specialist can help you look beyond the obvious option and consider the details that may otherwise be overlooked.",
];

export interface TravelAdvisorSectionProps {
  heading?: string;
  paragraphs?: string[];
  imageSrc?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function TravelAdvisorSection({
  heading = "Why Expert Travel Advice Can Make Your Journey Easier",
  paragraphs = DEFAULT_PARAGRAPHS,
  imageSrc = TRAVEL_ADVISOR_IMAGE.src,
  buttonLabel = "Connect With Travel Specialist",
  buttonHref = "#connect",
}: TravelAdvisorSectionProps = {}) {
  return (
    // overflow-x-hidden: see BusinessClassSection — clips the SectionReveal
    // x-offset slide-in so it can never cause page-level horizontal scroll.
    <section className="overflow-x-hidden bg-white py-16 sm:py-20">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-60}>
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
            <Image src={imageSrc} alt={TRAVEL_ADVISOR_IMAGE.alt} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
          </div>
        </SectionReveal>

        <SectionReveal x={60} delay={0.1}>
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`max-w-lg text-[16px] leading-relaxed text-text-gray ${index === 0 ? "mt-5" : "mt-4"}`}
            >
              {paragraph}
            </p>
          ))}
          <div className="mt-8">
            <Link
              href={buttonHref}
              className="inline-flex items-center rounded-full bg-navy-deep px-7 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-navy-dark"
            >
              {buttonLabel}
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
