import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { INSIGHTS } from "@/data/content";

export function TravelInsights() {
  return (
    <section id="insights" className="bg-white py-20 sm:py-28">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Resources</span>
          <h2 className="mt-3 text-3xl font-bold text-text-dark sm:text-4xl lg:text-[42px]">
            Travel Insights &amp; Flight Expertise
          </h2>
          <p className="mt-4 text-base text-text-gray sm:text-lg">
            Useful information for smarter international travel.
          </p>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {INSIGHTS.map((article, index) => (
            <SectionReveal key={article.id} delay={index * 0.1}>
              <article className="group h-full overflow-hidden rounded-card border border-navy-deep/8 bg-white shadow-card">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="eyebrow">{article.category}</span>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-text-dark">{article.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-gray">{article.description}</p>
                  <a
                    href={article.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald transition-colors hover:text-navy-deep"
                  >
                    Read More
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
