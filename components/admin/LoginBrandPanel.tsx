import Image from "next/image";
import { BadgeCheck, LineChart, ShieldCheck } from "lucide-react";
import { unsplash } from "@/lib/images";

const HIGHLIGHTS = [
  { icon: ShieldCheck, text: "Role-based access, session-audited" },
  { icon: LineChart, text: "Manage offers, airports, and content in one place" },
  { icon: BadgeCheck, text: "Built for the MultiCityExperts operations team" },
] as const;

/**
 * Left-hand brand panel for the split-screen admin login. Reuses the same
 * verified Unsplash asset as the marketing site's Travel Insights section
 * (`insight-3`, an aircraft wing above the clouds at sunset) rather than
 * introducing an unvetted image.
 */
export function LoginBrandPanel() {
  return (
    <div className="relative hidden h-full min-h-svh w-1/2 overflow-hidden bg-sidebar lg:block">
      <Image
        src={unsplash("1436491865332-7a61a109cc05")}
        alt="An aircraft wing above the clouds during a sunset flight"
        fill
        priority
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041627] via-[#041627]/70 to-[#041627]/30" />
      <div className="relative flex h-full min-h-svh flex-col justify-between p-10 xl:p-14">
        <span className="font-heading text-xl font-semibold text-white">
          MultiCity<span className="text-primary">Experts</span>
        </span>

        <div className="max-w-md space-y-6">
          <h2 className="font-heading text-3xl leading-tight font-semibold text-white xl:text-4xl">
            Run the business behind every trip.
          </h2>
          <p className="text-sm text-white/70">
            One panel for pages, airports, airlines, offers, and content — built to keep the
            booking experience fast, accurate, and on-brand.
          </p>
          <ul className="space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/10">
                  <Icon className="size-4 text-primary" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/50">© {new Date().getFullYear()} MultiCityExperts. All rights reserved.</p>
      </div>
    </div>
  );
}
