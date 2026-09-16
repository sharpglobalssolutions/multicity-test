"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TocItem } from "@/lib/toc";

const INDENT_BY_LEVEL: Record<TocItem["level"], string> = {
  1: "pl-0",
  2: "pl-0",
  3: "pl-3",
};

// Roughly the sticky site header's height, so a heading counts as
// "current" once it passes just below the header rather than exactly at
// the top edge of the viewport — same offset `PolicyToc` uses.
const SCROLL_OFFSET = 120;

/** The "On this Page" sidebar card on a blog detail page. Same active-
 * heading-tracking mechanism as `PolicyToc` (that component's own card
 * styling didn't fit this page's white-boxed-card design, so this is a
 * separate small component rather than bending `PolicyToc` to two
 * different visual contexts). */
export function BlogToc({ items }: { items: TocItem[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(items[0]?.slug ?? null);

  useEffect(() => {
    if (items.length === 0) return;

    function updateActiveHeading() {
      let current = items[0]?.slug ?? null;
      for (const item of items) {
        const el = document.getElementById(item.slug);
        if (el && el.getBoundingClientRect().top - SCROLL_OFFSET <= 0) {
          current = item.slug;
        }
      }
      setActiveSlug(current);
    }

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);
    return () => {
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-card border border-navy-deep/10 bg-white p-5 shadow-card"
    >
      <p className="text-sm font-semibold text-text-dark">On this Page</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => {
          const isActive = item.slug === activeSlug;
          return (
            <li key={item.slug} className={INDENT_BY_LEVEL[item.level]}>
              <Link
                href={`#${item.slug}`}
                aria-current={isActive ? "location" : undefined}
                className={`block py-0.5 text-sm leading-snug transition-colors ${
                  isActive ? "font-semibold text-emerald" : "text-text-gray hover:text-navy-deep"
                }`}
              >
                {item.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
