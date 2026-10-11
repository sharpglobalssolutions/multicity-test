import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { RawCodeInjector } from "@/components/RawCodeInjector";
import { cn } from "@/lib/utils";
import { getSiteSettingsSafely } from "@/services/site-settings.service";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Decorative use only (e.g. the oversized "Q" behind the FAQ accordion) —
// not part of the site's regular type system.
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-playfair",
  display: "swap",
});

/** JUST Sans (free Regular + Extra Bold weights only — see
 * `app/fonts/just-sans/NOTICE.md` for license/attribution terms). Each
 * face is declared over a *range* rather than its single real weight
 * (100–500 for Regular, 600–900 for Extra Bold) so every Tailwind
 * font-weight utility resolves to one of these two real files instead of
 * the browser synthesizing a fake bold for anything in between. */
const justSans = localFont({
  src: [
    { path: "./fonts/just-sans/JUSTSans-Regular.woff2", weight: "100 500", style: "normal" },
    { path: "./fonts/just-sans/JUSTSans-ExtraBold.woff2", weight: "600 900", style: "normal" },
  ],
  variable: "--font-just-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MultiCityExperts — Premium Business Class Travel",
  description:
    "Fly premium, pay smarter. MultiCityExperts finds exceptional business and first class fares for complex international itineraries, backed by expert travel advisors.",
};

// Re-fetched periodically rather than on every request, same ISR
// convention every page in this app uses — an admin's saved header/body/
// footer code change appears site-wide within 5 minutes, not instantly.
export const revalidate = 300;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettingsSafely();

  return (
    <html lang="en" className={cn(inter.variable, justSans.variable, playfairDisplay.variable, "font-sans")}>
      <head>
        <RawCodeInjector html={settings?.headerCode} target="head" />
      </head>
      {/* suppressHydrationWarning: browser extensions (Grammarly, ColorZilla,
          etc.) inject attributes like `data-gr-ext-installed` onto `<body>`
          before React hydrates — a real DOM mutation outside this app's
          control, not a server/client markup mismatch. This only silences
          attribute-mismatch warnings on this exact element; it doesn't
          suppress mismatches in `children`. */}
      <body suppressHydrationWarning>
        <RawCodeInjector html={settings?.bodyCode} target="body-start" />
        {children}
        <RawCodeInjector html={settings?.footerCode} target="body-end" />
      </body>
    </html>
  );
}
