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
    <section id="experts" ref={sectionRef} className="relative overflow-hidden bg-navy-deep py-20 sm:py-28">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={EXPERTS_BACKGROUND_IMAGE.src}
          alt={EXPERTS_BACKGROUND_IMAGE.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/95 via-navy-deep/90 to-navy-deep" />

      <div className="content-container relative z-10">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-[42px]">Why MultiCityExperts?</h2>
          <p className="mt-4 text-base text-white/70 sm:text-lg">More than a flight search.</p>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {EXPERT_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <SectionReveal key={feature.id} delay={index * 0.08} y={20}>
                <div className="flex h-full flex-col gap-4 rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald/15 text-emerald-bright">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold text-white">{feature.title}</h3>
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
