import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

const DEFAULT_COLUMNS: string[][] = [
  ["Seat width", "Bed length", "Privacy door", "Personal space & storage", "Dining space"],
  ["Entertainment", "Power and connectivity", "Bedding", "Cabin size"],
];

export interface FirstClassCabinSectionProps {
  heading?: string;
  body?: string;
  subheading?: string;
  twoColumnItems?: string[][];
  image?: string;
  imageAlt?: string;
}

/** A dark full-bleed section with a real foreground photo (not a background
 * image behind an overlay like `ComplexitySection`/`WorkAroundYouSection`)
 * — its own component since nothing else on the site pairs plain dark text
 * with a visible, non-overlaid image this way. All props optional, falling
 * back to the current hardcoded default — see `Hero.tsx` for the
 * rationale. */
export function FirstClassCabinSection({
  heading = "What Should You Look for in a First Class Cabin?",
  body = "A striking cabin photo doesn't tell you how the experience will feel throughout a long-haul journey.",
  subheading = "When comparing First Class products, consider:",
  twoColumnItems = DEFAULT_COLUMNS,
  image = unsplash("1569154941061-e231b4725ef1"),
  imageAlt = "A commercial aircraft on the tarmac at an airport terminal",
}: FirstClassCabinSectionProps = {}) {
  const columns = twoColumnItems.length === 2 ? twoColumnItems : [twoColumnItems[0] ?? [], twoColumnItems[1] ?? []];

  return (
    <section className="bg-[#0a0c11] py-10 sm:py-14">
      <div className="content-container grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-40}>
          <h2 className="text-2xl leading-tight text-white sm:text-4xl lg:text-[32px]">{heading}</h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">{body}</p>
          <p className="mt-5 text-[15px] font-semibold text-white">{subheading}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
            {columns.map((column, columnIndex) => (
              <ul key={columnIndex} className="space-y-2">
                {column.map((item) => (
                  <li key={item} className="text-[14px] text-white/80">
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal x={40} delay={0.1}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] sm:aspect-[16/11]">
            <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
