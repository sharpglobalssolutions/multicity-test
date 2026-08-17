"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQS } from "@/data/content";

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  return (
    <section id="faq" className="bg-navy-deep py-20 sm:py-28">
      <div className="content-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-[42px]">Common Questions</h2>
          <p className="mt-4 max-w-sm text-lg font-medium text-white/70">Everything You Need To Know</p>
        </div>

        <div className="divide-y divide-white/10 border-t border-white/10">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            const panelId = `${faq.id}-panel`;
            const triggerId = `${faq.id}-trigger`;

            return (
              <div key={faq.id}>
                <h3>
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left text-base font-semibold text-white sm:text-lg"
                  >
                    {faq.question}
                    <Plus
                      size={20}
                      aria-hidden="true"
                      className={`shrink-0 text-emerald transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    />
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
                      <p className="pb-6 pr-8 text-sm leading-relaxed text-white/70 sm:text-base">{faq.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
