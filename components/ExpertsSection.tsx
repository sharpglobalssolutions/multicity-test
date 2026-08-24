"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";
import { EXPERT_FEATURES, EXPERTS_BACKGROUND_IMAGE } from "@/data/content";

export function ExpertsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="experts" ref={sectionRef} className="relative overflow-hidden bg-navy-deep py-16 sm:py-20">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={EXPERTS_BACKGROUND_IMAGE.src}
          alt={EXPERTS_BACKGROUND_IMAGE.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/20 via-navy-deep/20 to-navy-deep/30" />

      <div className="content-container relative z-10">
        <SectionReveal className="mx-auto max-w-4xl text-center">
          
          <h2 className="mt-3 text-2xl text-white sm:text-4xl lg:text-[30px]">Why Choose MultiCity Experts for International Travel?</h2>
          <p className="mt-2 text-base text-white sm:text-[16px]"><strong>Over a Decade of International Travel Experience</strong></p>
          <p className="mt-2 text-base text-white sm:text-[16px]">For more than 11 years, our approach has been shaped by experience with international travel and complex flight requirements.</p>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:flex lg:items-start lg:gap-0 lg:divide-x lg:divide-white/15 mt-4">
          {EXPERT_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <SectionReveal key={feature.id} delay={index * 0.08} y={20} className="lg:flex-1 lg:px-6">
                <div className="flex flex-col items-center gap-3 text-center">
                  <Icon size={30} className="text-white" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{feature.description}</p>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
