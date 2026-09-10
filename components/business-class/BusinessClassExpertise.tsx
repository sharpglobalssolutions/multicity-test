import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { EXPERTISE_DESTINATION_IMAGES, POPULAR_ROUTES } from "@/data/business-class-content";

export function BusinessClassExpertise() {
  return (
    <section className="bg-gray-light py-16 sm:py-20">
      <div className="content-container grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-30}>
          <h2 className="text-2xl leading-tight text-text-dark sm:text-[30px]">
            Our Business
            <br />
            Class Expertise
          </h2>
          <p className="mt-5 max-w-md text-[16px] text-text-gray">
            More than a decade of specialist knowledge in international Business Class travel — evaluating routing,
            airlines and cabins across complex itineraries most search tools can&apos;t plan for.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {EXPERTISE_DESTINATION_IMAGES.map((deal) => (
              <div key={deal.id} className="relative aspect-square overflow-hidden rounded-input">
                <Image
                  src={deal.image}
                  alt={deal.alt}
                  fill
                  sizes="(min-width: 1024px) 15vw, 30vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal x={30} delay={0.1}>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-dark">Popular Routes</h3>
          <ul className="mt-5 divide-y divide-navy-deep/10 rounded-card border border-navy-deep/10 bg-white">
            {POPULAR_ROUTES.map((route) => (
              <li key={route.id} className="flex items-center gap-3 px-5 py-4 text-[15px] text-text-dark">
                <span className="font-medium">{route.originCity}</span>
                <ArrowRight size={14} className="text-emerald" aria-hidden="true" />
                <span className="font-medium">{route.destinationCity}</span>
              </li>
            ))}
          </ul>
        </SectionReveal>
      </div>
    </section>
  );
}
