import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, justSans.variable, "font-sans")}>
      <body>{children}</body>
    </html>
  );
}
