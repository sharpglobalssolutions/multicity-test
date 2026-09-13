import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

export interface ExpertiseDestinationImage {
  id: string;
  image: string;
  alt: string;
}

export interface ExpertiseRoute {
  id: string;
  originCity: string;
  destinationCity: string;
  href: string;
}

const DEFAULT_IMAGES: ExpertiseDestinationImage[] = [
  { id: "paris", image: unsplash("1502602898657-3e91760cbb34"), alt: "The Eiffel Tower rising above the rooftops of Paris" },
  {
    id: "london",
    image: unsplash("1513635269975-59663e0ac1ad"),
    alt: "The Elizabeth Tower and Houses of Parliament in London",
  },
  { id: "dubai", image: unsplash("1512453979798-5ea266f8880c"), alt: "The Dubai skyline with the Burj Khalifa at sunset" },
];

const DEFAULT_ROUTES: ExpertiseRoute[] = [
  { id: "paris", originCity: "New York", destinationCity: "Paris", href: "#" },
  { id: "rome", originCity: "Chicago", destinationCity: "Rome", href: "#" },
  { id: "tokyo", originCity: "Boston", destinationCity: "Tokyo", href: "#" },
  { id: "dubai", originCity: "Los Angeles", destinationCity: "Dubai", href: "#" },
];

export interface BusinessClassExpertiseProps {
  heading?: string[];
  images?: ExpertiseDestinationImage[];
  routes?: ExpertiseRoute[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. `images`/`routes` are this page's own
 * independent lists (previously `DEALS.slice(0,3)`/a `ROUTE_DEALS`
 * derivation reused from the homepage). */
export function BusinessClassExpertise({
  heading = ["Our Business", "Class Expertise"],
  images = DEFAULT_IMAGES,
  routes = DEFAULT_ROUTES,
}: BusinessClassExpertiseProps = {}) {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]"
        style={{
          backgroundImage: "url('/images/map.webp')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "min(1400px, 160%) auto",
        }}
      />

      <div className="content-container relative grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-10 lg:gap-20">
        <SectionReveal x={-30} className="min-w-0">
          <h2 className="text-[30px] uppercase leading-tight text-[#07111F] sm:text-[32px] lg:text-[34px]">
            {heading.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>

          <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
            {images.map((destination) => (
              <div
                key={destination.id}
                className="relative aspect-[210/172] w-full max-w-[210px] overflow-hidden rounded-[17px]"
              >
                <Image
                  src={destination.image}
                  alt={destination.alt}
                  fill
                  sizes="(min-width: 1280px) 210px, (min-width: 768px) 18vw, 30vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal x={30} delay={0.1} className="md:text-right">
          <h3 className="text-[21px] font-medium uppercase text-[#07111F]">Popular Routes</h3>
          <ul className="mt-6 space-y-5">
            {routes.map((route) => (
              <li key={route.id}>
                <Link
                  href={route.href}
                  className="inline-flex items-center gap-2.5 text-[16px] uppercase text-[#3F3F3F] transition-colors hover:text-[#07111F]"
                >
                  <span>{route.originCity}</span>
                  <ArrowRight size={14} className="text-[#9a9a9a]" aria-hidden="true" />
                  <span>{route.destinationCity}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs font-medium uppercase tracking-wide text-[#07111F]">
            Clickable Routes
            <br />
            (For Developer)
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
