"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { FAQS, type Faq } from "@/data/content";

export interface FAQProps {
  eyebrow?: string;
  heading?: string;
  faqs?: Faq[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function FAQ({
  eyebrow = "Common Questions",
  heading = "Everything You Need to Know",
  faqs = FAQS,
}: FAQProps = {}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="relative overflow-hidden bg-navy-deep py-20 sm:py-28">
      {/* Decorative abstract circles, bottom-left — low-contrast, purely
          ornamental, kept behind all content. */}
    
      {/* Decorative oversized "Q" — Playfair Display is used here only,
          purely as a background motif, never as the site's real type. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 left-[10px] select-none font-playfair text-[220px] font-normal leading-none text-white/[0.06]  sm:text-[300px] lg:text-[380px]"
      >
        Q
      </span>

      <div className="content-container relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr]  lg:gap-16">
        <SectionReveal x={-30}>
          <span className="text-white text-[20px]">{eyebrow}</span>
          <h2 className="mt-3 text-3xl leading-tight text-white sm:text-4xl lg:text-[30px]">{heading}</h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 h-[3px] bg-white"
          />
        </SectionReveal>

        <SectionReveal x={30} delay={0.1} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6 lg:p-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              const panelId = `${faq.id}-panel`;
              const triggerId = `${faq.id}-trigger`;

              return (
                <SectionReveal key={faq.id} delay={0.15 + index * 0.07} y={16}>
                  <motion.div
                    layout
                    transition={{ layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                    className={`overflow-hidden rounded-2xl bg-off-white transition-shadow duration-300 ${
                      isOpen ? "shadow-lg ring-1 ring-emerald/30" : "hover:shadow-md"
                    }`}
                  >
                    <h3>
                      <button
                        type="button"
                        id={triggerId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className="flex w-full items-center justify-between gap-2 p-2 text-left sm:p-3"
                      >
                        <span className="text-base font-semibold text-text-dark sm:text-lg">{faq.question}</span>
                        <motion.span
                          aria-hidden="true"
                          animate={{ rotate: isOpen ? 180 : 0, backgroundColor: isOpen ? "#00b67a" : "#0a0c11" }}
                          transition={{ type: "spring", stiffness: 300, damping: 22 }}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        >
                          <ChevronDown size={18} className="text-white" />
                        </motion.span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <motion.p
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="px-5 pb-5 text-sm leading-relaxed text-text-gray sm:px-6 sm:pb-6 sm:text-base"
                          >
                            {faq.answer}
                          </motion.p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                </SectionReveal>
              );
            })}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
