"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { MobileMenu } from "@/components/MobileMenu";
import { NAV_LINKS } from "@/data/content";

const SCROLL_THRESHOLD = 40;

/** Tried in order — whichever file actually exists in `public/logo/` wins.
 * See `public/logo/README.md` for how to add one. Falls back to the text
 * wordmark below if neither is present, so nothing looks broken until a
 * logo file is added. */
const LOGO_SOURCES = ["/logo/logo.svg", "/logo/logo.png"];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoSourceIndex, setLogoSourceIndex] = useState(0);
  const logoSrc = LOGO_SOURCES[logoSourceIndex];

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
            ? "bg-[#f0f0f0] shadow-[0_8px_30px_-12px_rgba(3,24,39,0.6)] backdrop-blur-md"
            : "bg-[#f0f0f0]"
        }`}
      >
        <div className="content-container flex h-20 items-center justify-between">
          <Link href="#top" aria-label="MultiCityExperts home" className="flex items-center">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt="MultiCityExperts"
                width={250}
                height={40}
                priority
                className="site-logo"
                onError={() => setLogoSourceIndex((index) => index + 1)}
              />
            ) : (
              <span className="font-heading text-xl font-bold tracking-tight text-black sm:text-2xl">
                MultiCity<span className="text-emerald">Experts</span>
              </span>
            )}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-md font-medium text-black transition-colors duration-200 hover:text-emerald-bright"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
         
            <a href="tel:1869-504-657"  className="px-5 py-2.5 text-[16px] bg-black text-white rounded-4xl transition hover:bg-[#03a86b]">
             1869-504-657
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="flex items-center justify-center rounded-btn border border-white/20 p-2.5 text-white  lg:hidden"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
