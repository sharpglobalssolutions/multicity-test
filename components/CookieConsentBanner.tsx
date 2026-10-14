"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCookieConsentStatus,
  setCookieConsentStatus,
} from "@/lib/cookie-consent";

export interface CookieConsentBannerProps {
  enabled?: boolean;
  message?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  policyHref?: string;
  privacyHref?: string;
}

/** Bottom-fixed cookie-consent prompt, shown once per visitor until they
 * choose — "Accept" lets the header/body/footer scripts configured in
 * admin Settings run (see `RawCodeInjector`'s `requireConsent` prop);
 * "Reject" keeps them off. Rendered from `Footer.tsx` (not the root
 * layout) so it never shows on `/admin/*`, same reasoning as
 * `StickyCallButton`. Reads localStorage only after mount (`visible`
 * starts `false`) so server and first client render match — this never
 * flashes on a visitor who already decided, and never shows at all when
 * `enabled` is false. */
export function CookieConsentBanner({
  enabled = true,
  message = "We use cookies to improve your experience and for analytics. By clicking “Accept”, you agree to our use of cookies.",
  acceptLabel = "Accept",
  rejectLabel = "Reject",
  policyHref = "/cookie-policy",
  privacyHref = "/privacy-policy",
}: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setVisible(getCookieConsentStatus() === null);
  }, [enabled]);

  if (!visible) return null;

  function decide(status: "accepted" | "rejected") {
    setCookieConsentStatus(status);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-20 left-4 right-4 z-[60] max-w-sm rounded-2xl border border-white/10 bg-navy-deep p-4 text-white shadow-2xl sm:right-auto lg:bottom-6"
    >
      <p className="text-[13px] leading-relaxed text-white/85">{message}</p>
      <p className="mt-2 text-[13px] text-white/70">
        <Link
          href={privacyHref}
          className="underline underline-offset-2 hover:text-white"
        >
          Privacy Policy
        </Link>
        {" · "}
        <Link
          href={policyHref}
          className="underline underline-offset-2 hover:text-white"
        >
          Cookie Policy
        </Link>
      </p>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={() => decide("rejected")}
          className="rounded-full border border-white/25 px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:border-white/50"
        >
          {rejectLabel}
        </button>
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="rounded-full bg-emerald px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-emerald-bright"
        >
          {acceptLabel}
        </button>
      </div>
    </div>
  );
}
