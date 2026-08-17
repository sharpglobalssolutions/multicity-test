"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { MobileMenu } from "@/components/MobileMenu";
import { NAV_LINKS } from "@/data/content";

const SCROLL_THRESHOLD = 40;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy-deep/95 shadow-[0_8px_30px_-12px_rgba(3,24,39,0.6)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="content-container flex h-20 items-center justify-between">
          <Link href="#top" className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
            MultiCity<span className="text-emerald">Experts</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/85 transition-colors duration-200 hover:text-emerald-bright"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="tel:+18005550142"
              className="flex items-center gap-2 text-sm font-medium text-white/85 transition-colors duration-200 hover:text-emerald-bright"
            >
              <Phone size={16} className="text-emerald" aria-hidden="true" />
              +1 (800) 555-0142
            </a>
            <Button href="#flights" variant="primary" className="px-5 py-2.5 text-[13px]">
              Get a Quote
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="flex items-center justify-center rounded-btn border border-white/20 p-2.5 text-white lg:hidden"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
