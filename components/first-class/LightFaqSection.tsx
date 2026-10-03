"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import type { Faq } from "@/data/content";

const DEFAULT_FAQS: Faq[] = [
  {
    id: "whats-included",
    question: "What is included with an international First Class ticket?",
    answer:
      "What's included varies by airline, route, airport and fare. First Class may include premium seating, enhanced dining, lounge access and priority airport services, but benefits should always be checked for your specific itinerary.",
  },
  {
    id: "which-routes",
    question: "Which international routes offer First Class?",
    answer:
      "First Class availability is more limited than Business Class and varies by airline, aircraft and travel date. We can help you identify suitable options based on your journey.",
  },
  {
    id: "difference",
    question: "What is the difference between Business Class and First Class?",
    answer:
      "The differences can include seating, privacy, dining, lounge access, ground services and service levels. The actual experience varies between airlines and aircraft.",
  },
  {
    id: "worth-it",
    question: "Is First Class worth it for long-haul travel?",
    answer:
      "It can be, particularly when privacy, sleeping comfort, personal space and premium service matter to you. For some journeys, Business Class may offer better overall value.",
  },
  {
    id: "multi-city",
    question: "Can you arrange multi-city First Class travel?",
    answer:
      "Yes — multi-city First Class is one of our specialties. We help plan connected itineraries across multiple destinations rather than booking each leg in isolation.",
  },
  {
    id: "rebooking",
    question: "Can I change or rebook my First Class flight?",
    answer:
      "Often yes, depending on the fare rules attached to your ticket. We check this upfront so there are no surprises if your plans change.",
  },
];

export interface LightFaqSectionProps {
  heading?: string;
  faqs?: Faq[];
}

/** A white-background FAQ variant — thin dividers instead of the shared
 * dark `FAQ` component's navy accordion cards (see `components/FAQ.tsx`).
 * Its own component rather than a `variant` prop on that one, since the
 * two don't share a visual language (card chrome, decorative "Q", gradient
 * progress bar) worth threading a flag through — this is a plainer list,
 * not a themed version of the same design. All props optional, falling
 * back to the current hardcoded default — see `Hero.tsx` for the
 * rationale. */
export function LightFaqSection({
  heading = "First Class Travel FAQs",
  faqs = DEFAULT_FAQS,
}: LightFaqSectionProps = {}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="content-container mx-auto max-w-3xl">
        <SectionReveal>
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
        </SectionReveal>

        <div className="mt-8 divide-y divide-navy-deep/10 border-t border-navy-deep/10">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const panelId = `${faq.id}-panel`;
            const triggerId = `${faq.id}-trigger`;

            return (
              <SectionReveal key={faq.id} delay={index * 0.05}>
                <h3>
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-lg text-text-dark sm:text-xl">{faq.question}</span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className="shrink-0 text-navy-deep"
                    >
                      <ChevronDown size={20} />
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
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[15px] leading-relaxed text-text-gray">{faq.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
