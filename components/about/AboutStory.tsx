"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";
import { STORY_IMAGES, STORY_PARAGRAPHS } from "@/data/about-content";

const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutStory() {
  return (
    <section className="overflow-x-hidden bg-white py-16 sm:py-24">
      <div className="content-container grid grid-cols-1 gap-20 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        {/* Left: large portrait with a smaller, older portrait overlapping its bottom-left */}
        <div className="relative">
          <SectionReveal x={-60} className="group relative aspect-[3/4] w-[60%] overflow-hidden rounded-md">
            <Image
              src={STORY_IMAGES.large.src}
              alt={STORY_IMAGES.large.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 36vw, 70vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </SectionReveal>
          <SectionReveal
            x={-40}
            y={20}
            delay={0.25}
            className="group absolute -bottom-10 left-[200px] aspect-[4/5] w-[46%] overflow-hidden rounded-md border-4 border-white sm:bottom-12"
          >
            <Image
              src={STORY_IMAGES.overlap.src}
              alt={STORY_IMAGES.overlap.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 18vw, 35vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </SectionReveal>
        </div>

        {/* Right: female portrait (with an offset gray block behind it), then the Our Story copy below */}
        <SectionReveal x={60} delay={0.1} className="mt-20 lg:mt-0">
          <div className="relative ml-auto w-[68%] max-w-[280px] lg:w-[78%]">
            <motion.div
              aria-hidden="true"
              className="absolute left-0 top-5 h-full w-full rounded-md bg-gray-light"
              initial={{ opacity: 0, x: -12, y: -12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            />
            <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-md">
              <Image
                src={STORY_IMAGES.female.src}
                alt={STORY_IMAGES.female.alt}
                fill
                loading="eager"
                sizes="(min-width: 1024px) 28vw, 55vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          <div className="mt-20 lg:mt-24">
            <h2 className="text-3xl font-semibold sm:text-4xl lg:text-[34px]">
              <motion.span
                className="inline-block text-text-gray/40"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
              >
                Our
              </motion.span>{" "}
              <motion.span
                className="inline-block text-text-dark"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
              >
                Story
              </motion.span>
            </h2>
            <div className="mt-6 max-w-md space-y-4">
              {STORY_PARAGRAPHS.map((paragraph, index) => (
                <SectionReveal key={index} delay={0.4 + index * 0.1} y={12}>
                  <p className="text-[16px] leading-relaxed text-text-gray">{paragraph}</p>
                </SectionReveal>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
