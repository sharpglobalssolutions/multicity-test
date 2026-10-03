import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

const DEFAULT_ITEMS: string[][] = [
  ["Which city to arrive in", "Where to depart from", "Whether to combine airlines", "Flexible or refundable fares"],
  ["How to avoid unnecessary backtracking", "Flight or rail connections between cities", "Business Class or other cabin options"],
];

export interface ComplexitySectionProps {
  heading?: string;
  subheading?: string;
  items?: string[][];
  backgroundImage?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. `items` mirrors `SupportSection`'s two-fixed-
 * columns shape (see `types/page-sections.ts`'s `McComplexitySectionData`). */
export function ComplexitySection({
  heading = "Why Multi-City Travel Can Get Complicated",
  subheading = "Planning several destinations means making more decisions. You may need to consider:",
  items = DEFAULT_ITEMS,
  backgroundImage = unsplash("1436491865332-7a61a109cc05"),
}: ComplexitySectionProps = {}) {
  const columns = items.length === 2 ? items : [items[0] ?? [], items[1] ?? []];

  return (
    <section className="relative flex min-h-[300px] items-center overflow-hidden bg-navy-deep py-10 sm:min-h-[360px] sm:py-14">
      <Image src={backgroundImage} alt="A traveler with luggage walking through an airport terminal" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />

      <div className="content-container relative z-10">
        <SectionReveal className="max-w-2xl">
          <h2 className="text-2xl text-white sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">{subheading}</p>
        </SectionReveal>

        <SectionReveal delay={0.15} className="mt-6 grid max-w-3xl grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
          {columns.map((column, columnIndex) => (
            <ul key={columnIndex} className="space-y-3">
              {column.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] text-white/90">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
