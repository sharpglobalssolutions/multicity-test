"use client";

import { motion } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";
import { WHY_CHOOSE_VALUES } from "@/data/why-choose-us-content";

/** A 6-item value-proposition grid — same visual language as
 * `AboutCoreValues` (accent line + title + description), kept as its own
 * component since this page's content lives in its own data file rather
 * than `about-content.ts`. */
export function WhyChooseValues() {
  return (
    <section className="bg-gray-light pb-10 pt-24 sm:pb-14 sm:pt-32">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-4xl text-center">
          <h2 className="text-[28px] leading-[32px] text-text-dark">
            Why Travellers Choose MultiCity Experts
          </h2>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_VALUES.map((value, index) => (
            <SectionReveal
              key={value.id}
              delay={index * 0.08}
              y={16}
              className="text-center sm:text-left"
            >
              <motion.div
                className="mx-auto h-[2px] w-10 bg-emerald sm:mx-0"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "2.5rem", opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08 + 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <h3 className="mt-4 text-lg text-text-dark">{value.title}</h3>
              <p className="mt-3 text-[13px] leading-[18px] text-text-gray">
                {value.description}
              </p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
