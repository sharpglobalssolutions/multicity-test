import { SectionReveal } from "@/components/SectionReveal";
import { BUSINESS_CLASS_SERVICES } from "@/data/business-class-content";

export function BusinessClassServices() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">Business Class Services</h2>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_CLASS_SERVICES.map((service, index) => (
            <SectionReveal key={service.title} delay={index * 0.05}>
              <h3 className="text-lg font-semibold text-text-dark">{service.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-gray">{service.description}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
