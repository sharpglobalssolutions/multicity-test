import { SectionReveal } from "@/components/SectionReveal";
import { HOW_IT_WORKS_STEPS } from "@/data/business-class-content";

export function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">How It Works</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">
            A simpler way to plan your business-class journey.
          </p>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <SectionReveal key={step.number} delay={index * 0.1} className="text-center">
              <span className="font-heading text-5xl font-bold text-navy-deep/10 sm:text-6xl">{step.number}</span>
              <h3 className="mt-2 text-xl font-semibold text-text-dark">{step.title}</h3>
              <p className="mt-2 text-[15px] text-text-gray">{step.description}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
