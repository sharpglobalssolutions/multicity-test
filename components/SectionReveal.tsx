"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds of delay before the animation starts (for staggering siblings). */
  delay?: number;
  /** Starting horizontal offset in px — negative slides in from the left. */
  x?: number;
  /** Starting vertical offset in px. */
  y?: number;
  /** Starting scale (1 = no scale animation). */
  scale?: number;
  duration?: number;
  once?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Generic "reveal on scroll into view" wrapper used across every major
 * section — fade plus an optional rise/slide/scale, depending on which of
 * `x`/`y`/`scale` are passed. One component covers the whole animation
 * system's section-reveal, image-slide-in, and search-card-scale-in cases
 * (see README's "Animation system") so every section shares the same
 * timing and easing instead of each hand-rolling its own.
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 0,
  scale = 1,
  duration = 0.7,
  once = true,
}: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y, scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
