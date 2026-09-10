import { Check } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { BEYOND_PRICE_BENEFITS } from "@/data/business-class-content";

export function BeyondPrice() {
  return (
    <section className="bg-navy-deep py-16 text-white sm:py-20">
      <div className="content-container grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionReveal x={-30}>
          <p className="eyebrow text-white/70">Our Approach</p>
          <h2 className="mt-3 text-3xl leading-tight text-white sm:text-4xl lg:text-[30px]">
            We Look Beyond
            <br />
            the Price.
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/70">
            Choosing a Business Class flight is rarely just about finding the lowest fare. Routing, airline, cabin
            experience and how much flexibility you have if plans change all shape whether a fare is actually the
            right fit for your journey.
          </p>
        </SectionReveal>

        <SectionReveal x={30} delay={0.1} className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0">
          {BEYOND_PRICE_BENEFITS.map((benefit, index) => (
            <div
              key={benefit}
              className={`flex items-center gap-3 py-5 sm:px-6 sm:py-8 ${
                index % 2 === 0 ? "sm:border-r sm:border-white/10" : ""
              } ${index < BEYOND_PRICE_BENEFITS.length - 2 ? "sm:border-b sm:border-white/10" : ""}`}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-bright">
                <Check size={16} aria-hidden="true" />
              </span>
              <span className="text-[16px] font-medium text-white">{benefit}</span>
            </div>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
