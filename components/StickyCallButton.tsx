import Link from "next/link";
import { Phone } from "lucide-react";

export interface StickyCallButtonProps {
  phone?: string;
}

/** A bottom-fixed "Call Now" bar, mobile only (`lg:hidden` — the same
 * breakpoint `HeaderClient` collapses its nav into the mobile menu at).
 * Desktop visitors already see the phone number in the header, so this
 * would be redundant there; on mobile, the header's number is harder to
 * reach while scrolled, so this keeps one tap to call available from
 * anywhere on the page. Rendered once, from `Footer.tsx` (shared by every
 * public page the same way `Footer` itself already is), reusing the same
 * `chrome.HEADER.phone` value the header shows — no separate number to
 * keep in sync. */
export function StickyCallButton({
  phone = "1869-504-657",
}: StickyCallButtonProps) {
  return (
    <Link
      href={`tel:${phone}`}
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 bg-navy-deep px-4 py-5 text-[15px] text-white shadow-[0_-4px_16px_rgba(0,0,0,0.12)] lg:hidden"
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <Phone size={18} aria-hidden="true" />
      Call Now: {phone}
    </Link>
  );
}
