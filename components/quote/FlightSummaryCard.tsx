import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { unsplash } from "@/lib/images";
import { TRIP_TYPE_LABELS, type TripType } from "@/lib/flightSearchTypes";

const SUMMARY_IMAGES = [
  { src: unsplash("1569154941061-e231b4725ef1"), alt: "Business class cabin seating" },
  { src: unsplash("1500835556837-99ac94a94552"), alt: "Airport departure lounge" },
  { src: unsplash("1488085061387-422e29b40080"), alt: "Aircraft window view above the clouds" },
];

const STATS = [
  { value: "200+", label: "International Routes" },
  { value: "95%", label: "Client Satisfaction" },
  { value: "20+", label: "Years Experience" },
];

export interface FlightSummaryCardProps {
  fromCity: string;
  fromIata: string;
  toCity: string;
  toIata: string;
  cabinClass: string;
  tripType: TripType;
  passengers: number;
}

function TripDetailDivider() {
  return <span aria-hidden="true" className="h-3.5 w-px bg-navy-deep/15" />;
}

export function FlightSummaryCard({
  fromCity,
  fromIata,
  toCity,
  toIata,
  cabinClass,
  tripType,
  passengers,
}: FlightSummaryCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden  border border-navy-deep/10 bg-white pb-14">
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-3 gap-3">
          {SUMMARY_IMAGES.map((image) => (
            <div key={image.src} className="relative aspect-square overflow-hidden rounded-input">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 640px) 20vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
          <span className="flex items-center gap-2 text-xl text-navy-deep sm:text-[22px]">
            {fromCity}
            <span className="rounded-md border border-navy-deep/15 px-2 py-0.5 font-semibold text-sm tracking-wide text-navy-deep">
              {fromIata}
            </span>
          </span>
          <ArrowRight size={20} strokeWidth={1.5} className="rotate-90 text-text-gray sm:rotate-0" aria-hidden="true" />
          <span className="flex items-center gap-2 text-xl  text-navy-deep sm:text-[22px]">
            {toCity}
            <span className="rounded-md border border-navy-deep/15 px-2 py-0.5 text-sm font-semibold tracking-wide text-navy-deep">
              {toIata}
            </span>
          </span>
        </div>

        <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center text-[15px] font-medium text-text-gray">
          <span>{cabinClass} Class</span>
          <TripDetailDivider />
          <span>{TRIP_TYPE_LABELS[tripType]}</span>
          <TripDetailDivider />
          <span>
            {passengers} {passengers === 1 ? "Passenger" : "Passengers"}
          </span>
        </p>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-[#00b67a] sm:text-2xl">Congratulations!</h2>
          <p className="mt-2 text-[15px] font-semibold text-navy-deep/70">
            Exclusive unpublished fares are available for your flight.
          </p>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-3 divide-x divide-navy-deep/10 border-t border-navy-deep/10 bg-gray-light py-6 text-center">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-xl text-navy-deep sm:text-2xl">{stat.value}</p>
            <p className="mt-1 text-[11px] leading-tight text-text-gray sm:text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
