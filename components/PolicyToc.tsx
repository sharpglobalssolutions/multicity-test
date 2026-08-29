"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TocItem } from "@/lib/toc";

const INDENT_BY_LEVEL: Record<TocItem["level"], string> = {
  1: "pl-4",
  2: "pl-6",
  3: "pl-8",
};

// Roughly the sticky site header's height, so a heading counts as
// "current" once it passes just below the header rather than exactly at
// the top edge of the viewport.
const SCROLL_OFFSET = 120;

/** Client-only piece of the policy page: highlights whichever heading the
 * reader has scrolled past, so the table of contents tracks reading
 * position. Kept separate from `PolicyPageTemplate` so the hero and main
 * content stay server-rendered — only this nav needs browser APIs. */
export function PolicyToc({ items }: { items: TocItem[] }) {
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
    <nav aria-label="Table of contents" className="order-1 lg:sticky lg:top-24 lg:order-none lg:self-start">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-gray">Table of Content</p>
      <ul className="mt-4 space-y-1 border-l border-navy-deep/10">
        {items.map((item) => {
          const isActive = item.slug === activeSlug;
          return (
            <li key={item.slug}>
              <Link
                href={`#${item.slug}`}
                aria-current={isActive ? "location" : undefined}
                className={`block border-l-2 py-1.5 text-sm transition-colors ${INDENT_BY_LEVEL[item.level]} ${
                  isActive
                    ? "border-navy-deep font-semibold text-navy-deep"
                    : "border-transparent text-text-gray hover:border-navy-deep/40 hover:text-navy-deep"
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
