"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType } from "react";

type AnimationMode = "line" | "word" | "char";

interface AnimatedTextProps {
  /** A single line, or an array where each entry renders on its own line. */
  text: string | string[];
  mode?: AnimationMode;
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** Seconds before the first unit starts animating. */
  delay?: number;
  /** Seconds between each unit's animation start. */
  stagger?: number;
  once?: boolean;
}

const UNIT_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveals text line-by-line, word-by-word, or character-by-character as it
 * scrolls into view — fade + slight rise + blur-to-clear. Reserved for
 * hero/section/CTA headings (see README); everything else uses plain
 * static text or `SectionReveal`, since animating every line of body copy
 * would be noisy rather than premium.
 */
export function AnimatedText({
  text,
  mode = "line",
  as: Tag = "span",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
  once = true,
}: AnimatedTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const lines = Array.isArray(text) ? text : [text];

  if (prefersReducedMotion) {
    return (
      <Tag className={className}>
        {lines.map((line, index) => (
          <span key={index} className={lineClassName} style={{ display: mode === "line" ? "block" : undefined }}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-10% 0px" }}
        variants={{ visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
        style={{ display: "inline" }}
      >
        {lines.map((line, lineIndex) => {
          if (mode === "line") {
            return (
              <motion.span
                key={lineIndex}
                variants={UNIT_VARIANTS}
                transition={{ duration: 0.7, ease: EASE }}
                className={lineClassName}
                style={{ display: "block" }}
              >
                {line}
              </motion.span>
            );
          }

          const units = mode === "word" ? line.split(" ") : Array.from(line);

          return (
            <span key={lineIndex} className={lineClassName} style={{ display: "block" }}>
              {units.map((unit, unitIndex) => (
                <motion.span
                  key={unitIndex}
                  variants={UNIT_VARIANTS}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ display: "inline-block" }}
                >
                  {unit === " " ? " " : unit}
                  {mode === "word" && unitIndex < units.length - 1 ? " " : ""}
                </motion.span>
              ))}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
