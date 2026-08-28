"use client";

import { motion } from "framer-motion";
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
            <SectionReveal key={value.id} delay={index * 0.08} y={16} className="text-center sm:text-left">
              <motion.div
                className="mx-auto h-[2px] w-10 bg-emerald sm:mx-0"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "2.5rem", opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: index * 0.08 + 0.15, ease: [0.22, 1, 0.36, 1] }}
              />
              <h3 className="mt-4 text-lg font-semibold text-text-dark">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-gray">{value.description}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
