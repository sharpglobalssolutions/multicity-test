import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { SUPPORT_ITEMS, SUPPORT_SPECIALIST_IMAGE } from "@/data/content";

const DEFAULT_PARAGRAPHS = [
  "International travel doesn't always go according to plan. Flights get rescheduled. Connections are missed. Travel dates change. Unexpected situations can turn a straightforward journey into a stressful one. That's why access to human support matters.",
  "Our travel specialists provide 24×7 travel assistance for eligible travel requirements, including:",
];

export interface SupportSectionProps {
  heading?: string;
  paragraphs?: string[];
  items?: string[][];
  imageSrc?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function SupportSection({
  heading = "Get 24×7 Support When Your Travel Plans Change",
  paragraphs = DEFAULT_PARAGRAPHS,
  items = SUPPORT_ITEMS.map((column) => [...column]),
  imageSrc = SUPPORT_SPECIALIST_IMAGE.src,
}: SupportSectionProps = {}) {
  return (
    // overflow-x-hidden: see BusinessClassSection — clips the SectionReveal
    // x-offset slide-in so it can never cause page-level horizontal scroll.
    <section className="overflow-x-hidden bg-white py-16 sm:py-14">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-60} className="lg:order-1">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`max-w-lg text-[16px] leading-relaxed text-text-gray ${index === 0 ? "mt-5" : "mt-4"}`}
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 max-w-lg">
            {items.map((column, columnIndex) => (
              <ul key={columnIndex} className="space-y-3">
                {column.map((item) => (
                  <li key={item} className="text-[16px] font-medium text-navy-deep">
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal x={60} delay={0.1} className="lg:order-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
            <Image
              src={imageSrc}
              alt={SUPPORT_SPECIALIST_IMAGE.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
