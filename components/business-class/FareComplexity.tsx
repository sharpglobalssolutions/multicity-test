import { SectionReveal } from "@/components/SectionReveal";
import { FARE_COMPLEXITY_ITEMS } from "@/data/business-class-content";

export function FareComplexity() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">Why Business Class Fares Are Complex</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">What Affects Your Fare, Flexibility &amp; Options</p>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {FARE_COMPLEXITY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <SectionReveal key={item.id} delay={index * 0.05} className="flex flex-col items-center gap-3 text-center">
                <span className="flex size-16 items-center justify-center rounded-full border border-navy-deep/10 bg-gray-light text-navy-deep">
                  <Icon size={26} aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-text-dark">{item.label}</p>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
