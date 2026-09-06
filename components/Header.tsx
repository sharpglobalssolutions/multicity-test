import { HeaderClient } from "@/components/HeaderClient";
import { getChromeSectionsSafely } from "@/services/chrome.service";

/** Thin async Server Component: fetches the site chrome's `HEADER` section
 * (see `services/chrome.service.ts`) and hands it to `HeaderClient`, which
 * owns the actual interactive markup (scroll listener, mobile menu state)
 * and every prop's hardcoded default. Called as plain `<Header />` from
 * every page, same as `Footer` already is — no page file needs to know
 * this fetches anything. */
export async function Header() {
  const chrome = await getChromeSectionsSafely();
  const header = chrome.HEADER;

  return <HeaderClient logoImageSrc={header?.logoImageSrc} phone={header?.phone} navLinks={header?.navLinks} />;
}
