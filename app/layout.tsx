import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "MultiCityExperts — Premium Business Class Travel",
  description:
    "Fly premium, pay smarter. MultiCityExperts finds exceptional business and first class fares for complex international itineraries, backed by expert travel advisors.",
};

// Re-fetched periodically rather than on every request, same ISR
// convention every page in this app uses — an admin's saved header/body/
// footer code change appears site-wide within 5 minutes, not instantly.
export const revalidate = 300;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettingsSafely();

  return (
    <html
      lang="en"
      className={cn(inter.variable, "font-sans")}
    >
      <head>
        <RawCodeInjector
          html={settings?.headerCode}
          target="head"
          requireConsent={settings?.cookieConsentEnabled ?? true}
        />
      </head>
      {/* suppressHydrationWarning: browser extensions (Grammarly, ColorZilla,
          etc.) inject attributes like `data-gr-ext-installed` onto `<body>`
          before React hydrates — a real DOM mutation outside this app's
          control, not a server/client markup mismatch. This only silences
          attribute-mismatch warnings on this exact element; it doesn't
          suppress mismatches in `children`. */}
      <body suppressHydrationWarning>
        <RawCodeInjector
          html={settings?.bodyCode}
          target="body-start"
          requireConsent={settings?.cookieConsentEnabled ?? true}
        />
        {children}
        <RawCodeInjector
          html={settings?.footerCode}
          target="body-end"
          requireConsent={settings?.cookieConsentEnabled ?? true}
        />
      </body>
    </html>
  );
}
