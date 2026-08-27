import Image from "next/image";
import { Check } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { WHY_CHOOSE_IMAGE, WHY_CHOOSE_ITEMS } from "@/data/about-content";

export function AboutWhyChooseUs() {
  return (
    <section className="overflow-x-hidden bg-white py-16 sm:py-20">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-60}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card sm:aspect-[16/11]">
            <Image
              src={WHY_CHOOSE_IMAGE.src}
              alt={WHY_CHOOSE_IMAGE.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </SectionReveal>

        <SectionReveal x={60} delay={0.1}>
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">Why Travellers Choose Multicity Experts</h2>

          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {WHY_CHOOSE_ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[15px] font-medium text-navy-deep">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <Check size={12} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
}
