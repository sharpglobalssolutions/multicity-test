"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { Button } from "@/components/Button";
import { NAV_LINKS } from "@/data/content";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-navy-deep/70 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-y-0 right-0 z-[70] flex w-[82%] max-w-sm flex-col bg-navy-deep px-6 py-6 shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-white">
                MultiCity<span className="text-emerald">Experts</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex items-center justify-center rounded-btn border border-white/20 p-2.5 text-white"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile primary" className="mt-10 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="rounded-btn px-3 py-3.5 text-base font-medium text-white/90 transition-colors duration-200 hover:bg-white/5 hover:text-emerald-bright"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-6">
              <a
                href="tel:+18005550142"
                className="flex items-center gap-2 text-sm font-medium text-white/85"
              >
                <Phone size={16} className="text-emerald" aria-hidden="true" />
                +1 (800) 555-0142
              </a>
              <Button href="#flights" variant="primary" onClick={onClose} className="w-full">
                Get a Quote
              </Button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
