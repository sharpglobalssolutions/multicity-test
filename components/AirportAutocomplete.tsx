"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { MapPin, Plane } from "lucide-react";
import {
  getPopularAirports,
  highlightSegments,
  loadAirports,
  searchAirports,
  type Airport,
  type AirportSearchResult,
} from "@/lib/airportSearch";

interface AirportAutocompleteProps {
  label: string;
  placeholder?: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
}

function displayValue(airport: Airport | null): string {
  return airport ? `${airport.city} (${airport.iata})` : "";
}

/**
 * Airport search field backed by `lib/airportSearch.ts` — shows city +
 * country prominently, the airport name below it, and the IATA code as a
 * badge on the right (per the design spec's dropdown layout). The input
 * always reflects free-typed text while the user is searching; `value`
 * (the actually-selected airport) only changes on an explicit selection,
 * and the displayed text reverts to match `value` on blur if nothing was
 * selected — so what's shown always corresponds to a real airport once
 * the field isn't focused.
 */
export function AirportAutocomplete({ label, placeholder = "City or airport", value, onChange }: AirportAutocompleteProps) {
  const [query, setQuery] = useState(() => displayValue(value));
  const [results, setResults] = useState<AirportSearchResult[]>([]);
  const [popularAirports, setPopularAirports] = useState<AirportSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const isPopularMode = !query.trim();

  useEffect(() => {
    setQuery(displayValue(value));
  }, [value]);

  // Warms the (fetched-once, cached) airport dataset as soon as this field
  // mounts, so the first keystroke's search doesn't have to wait on it —
  // and loads the popular-destinations list shown when the field is
  // focused before the user has typed anything.
  useEffect(() => {
    loadAirports()
      .then(getPopularAirports)
      .then((popular) => setPopularAirports(popular.map((airport) => ({ ...airport, matchField: "city" }))))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    let cancelled = false;
    const handle = setTimeout(() => {
      searchAirports(query, 8)
        .then((found) => {
          if (!cancelled) {
            setResults(found);
            setActiveIndex(-1);
          }
        })
        .catch(() => undefined);
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query]);

  function selectAirport(airport: Airport) {
    onChange(airport);
    setQuery(displayValue(airport));
    setOpen(false);
    setActiveIndex(-1);
  }

  const displayedResults = isPopularMode ? popularAirports : results;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!displayedResults.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % displayedResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? displayedResults.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      if (activeIndex >= 0) {
        event.preventDefault();
        const chosen = displayedResults[activeIndex];
        if (chosen) selectAirport(chosen);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = open && displayedResults.length > 0;
  const inputId = `${listboxId}-input`;

  return (
    <div className="relative flex-1">
      <label htmlFor={inputId} className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-white">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-navy-deep/5 text-navy-deep">
          <MapPin size={14} aria-hidden="true" />
        </span>
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            setQuery(displayValue(value));
          }}
          onKeyDown={handleKeyDown}
          className="w-full rounded-input border border-navy-deep/10 bg-white py-3.5 pl-12 pr-3 text-sm font-medium text-text-dark outline-none transition-all duration-200 hover:border-navy-deep/20 focus:border-emerald focus:shadow-[0_0_0_4px_rgba(0,182,122,0.12)]"
        />
      </div>

      {showDropdown ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={`${label} suggestions`}
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-auto rounded-card border border-navy-deep/10 bg-white py-2 shadow-soft"
        >
          {isPopularMode ? (
            <li aria-hidden="true" className="px-4 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-text-gray">
              Popular destinations
            </li>
          ) : null}
          {displayedResults.map((airport, index) => {
            const nameSegments = highlightSegments(airport.name, query);
            const citySegments = highlightSegments(`${airport.city}, ${airport.country}`, query);
            const active = index === activeIndex;

            return (
              <li key={airport.iata} id={`${listboxId}-option-${index}`} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectAirport(airport);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                    active ? "bg-gray-light" : "bg-white"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                      <Plane size={14} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-text-dark">
                        {citySegments.map((segment, i) => (
                          <span key={i} className={segment.match ? "text-emerald" : undefined}>
                            {segment.text}
                          </span>
                        ))}
                      </span>
                      <span className="block truncate text-xs text-text-gray">
                        {nameSegments.map((segment, i) => (
                          <span key={i} className={segment.match ? "font-semibold text-emerald" : undefined}>
                            {segment.text}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 rounded-md bg-navy-deep px-2 py-1 text-[11px] font-bold tracking-wide text-white">
                    {airport.iata}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
