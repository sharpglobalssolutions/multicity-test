import { SectionReveal } from "@/components/SectionReveal";
import { CORE_VALUES } from "@/data/about-content";

export function AboutCoreValues() {
  return (
    <section className="bg-gray-light py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">Our Core Values</h2>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_VALUES.map((value, index) => (
            <SectionReveal key={value.id} delay={index * 0.06} y={16} className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-text-dark">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-gray">{value.description}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
