"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
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

        <SectionReveal delay={0.15} className="relative mt-12 px-9 sm:px-11">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: ".experts-prev", nextEl: ".experts-next" }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 0 },
            }}
            wrapperClass="lg:divide-x lg:divide-white/30"
            className="overflow-hidden!"
          >
            {EXPERT_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <SwiperSlide key={feature.id} className="h-auto">
                  <div className="flex h-full flex-col items-center gap-3 text-center lg:px-6">
                    <Icon size={30} className="text-white" aria-hidden="true" />
                    <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-white/70">{feature.description}</p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button
            type="button"
            aria-label="Previous feature"
            className="experts-prev absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy-deep/70 text-white backdrop-blur transition-colors hover:border-white hover:bg-navy-deep"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next feature"
            className="experts-next absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy-deep/70 text-white backdrop-blur transition-colors hover:border-white hover:bg-navy-deep"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </SectionReveal>
      </div>
    </section>
  );
}
