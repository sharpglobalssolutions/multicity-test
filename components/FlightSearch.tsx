"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeftRight, Calendar, ChevronDown, Search, Users2 } from "lucide-react";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { Button } from "@/components/Button";
import type { Airport } from "@/lib/airportSearch";

type TripType = "round-trip" | "one-way" | "multi-city";

const TABS: { id: TripType; label: string }[] = [
  { id: "round-trip", label: "Round Trip" },
  { id: "one-way", label: "One Way" },
  { id: "multi-city", label: "Multi City" },
];

const CABIN_CLASSES = ["Economy", "Premium Economy", "Business", "First"];

const FIELD_CLASSES =
  "w-full appearance-none rounded-input border border-navy-deep/10 bg-gray-light py-3 pl-10 pr-3 text-sm font-medium text-text-dark outline-none transition-colors focus:border-emerald focus:bg-white";

const FIELD_LABEL_CLASSES = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-text-gray";

/**
 * The floating flight-search card. There's no live fare inventory behind
 * this yet (no search API was part of this build) — submitting shows a
 * brief confirmation state so the form still feels complete and usable
 * rather than a no-op.
 */
export function FlightSearch() {
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("Business");
  const [submitted, setSubmitted] = useState(false);

  const todayIso = new Date().toISOString().slice(0, 10);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <div className="w-full rounded-card bg-white p-5 shadow-soft sm:p-7">
      <div className="mb-5 flex gap-1 rounded-input bg-gray-light p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTripType(tab.id)}
            aria-pressed={tripType === tab.id}
            className={`flex-1 whitespace-nowrap rounded-[7px] px-2 py-2 text-xs font-semibold transition-colors sm:px-3 sm:text-[13px] ${
              tripType === tab.id ? "bg-navy-deep text-white shadow-sm" : "text-text-gray hover:text-navy-deep"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <AirportAutocomplete label="From" value={from} onChange={setFrom} placeholder="Origin city or airport" />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap origin and destination"
            className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-navy-deep/10 bg-gray-light text-navy-deep transition-all duration-300 hover:rotate-180 hover:border-emerald hover:text-emerald sm:mb-0.5 sm:self-end"
          >
            <ArrowLeftRight size={16} aria-hidden="true" />
          </button>
          <AirportAutocomplete label="To" value={to} onChange={setTo} placeholder="Destination city or airport" />
        </div>

        <div className={`grid gap-3 ${tripType === "round-trip" ? "grid-cols-2" : "grid-cols-1"}`}>
          <div>
            <label className={FIELD_LABEL_CLASSES} htmlFor="departure-date">
              Departure
            </label>
            <div className="relative">
              <Calendar size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray" aria-hidden="true" />
              <input
                id="departure-date"
                type="date"
                required
                min={todayIso}
                value={departure}
                onChange={(event) => setDeparture(event.target.value)}
                className={FIELD_CLASSES}
              />
            </div>
          </div>

          {tripType === "round-trip" ? (
            <div>
              <label className={FIELD_LABEL_CLASSES} htmlFor="return-date">
                Return
              </label>
              <div className="relative">
                <Calendar size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray" aria-hidden="true" />
                <input
                  id="return-date"
                  type="date"
                  required
                  min={departure || todayIso}
                  value={returnDate}
                  onChange={(event) => setReturnDate(event.target.value)}
                  className={FIELD_CLASSES}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={FIELD_LABEL_CLASSES} htmlFor="passengers">
              Passengers
            </label>
            <div className="relative">
              <Users2 size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray" aria-hidden="true" />
              <select
                id="passengers"
                value={passengers}
                onChange={(event) => setPassengers(Number(event.target.value))}
                className={`${FIELD_CLASSES} pr-8`}
              >
                {Array.from({ length: 9 }, (_, i) => i + 1).map((count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? "Passenger" : "Passengers"}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-gray" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label className={FIELD_LABEL_CLASSES} htmlFor="cabin-class">
              Class
            </label>
            <div className="relative">
              <select
                id="cabin-class"
                value={cabinClass}
                onChange={(event) => setCabinClass(event.target.value)}
                className={`${FIELD_CLASSES} pl-3.5 pr-8`}
              >
                {CABIN_CLASSES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-gray" aria-hidden="true" />
            </div>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full">
          <Search size={16} aria-hidden="true" />
          {submitted ? "Request Received" : "Search Flights"}
        </Button>
      </form>
    </div>
  );
}
