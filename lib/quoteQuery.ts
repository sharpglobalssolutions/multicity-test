import type { Airport } from "@/lib/airportSearch";
import type { TripType } from "@/lib/flightSearchTypes";

export interface QuoteCriteria {
  tripType: TripType;
  from: Airport;
  to: Airport;
  departure: string;
  returnDate: string;
  passengers: number;
  cabinClass: string;
}

/** Shown when `/quote` is opened without search criteria in the URL (a
 * direct link, or a search where the visitor never picked an airport) —
 * matches the reference screenshot's example route so the page never
 * renders with blank fields. */
const DEFAULT_CRITERIA: QuoteCriteria = {
  tripType: "round-trip",
  from: {
    iata: "JFK",
    icao: null,
    name: "John F. Kennedy International Airport",
    city: "New York",
    country: "United States",
    countryCode: "US",
    lat: 0,
    lon: 0,
  },
  to: {
    iata: "LHR",
    icao: null,
    name: "Heathrow Airport",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    lat: 0,
    lon: 0,
  },
  departure: "",
  returnDate: "",
  passengers: 2,
  cabinClass: "Business",
};

/** Serializes the flight-search criteria collected in `FlightSearch` into
 * a query string for `/quote` — only the fields the quote page actually
 * displays or pre-fills are carried over (full `Airport` records are
 * looked up client-side, not round-tripped through the URL). */
export function buildQuoteQueryString(criteria: {
  tripType: TripType;
  from: Airport | null;
  to: Airport | null;
  departure: string;
  returnDate: string;
  passengers: number;
  cabinClass: string;
}): string {
  const params = new URLSearchParams();
  params.set("tripType", criteria.tripType);
  if (criteria.from) {
    params.set("fromIata", criteria.from.iata);
    params.set("fromCity", criteria.from.city);
    params.set("fromName", criteria.from.name);
  }
  if (criteria.to) {
    params.set("toIata", criteria.to.iata);
    params.set("toCity", criteria.to.city);
    params.set("toName", criteria.to.name);
  }
  if (criteria.departure) params.set("departure", criteria.departure);
  if (criteria.tripType === "round-trip" && criteria.returnDate) {
    params.set("returnDate", criteria.returnDate);
  }
  params.set("passengers", String(criteria.passengers));
  params.set("cabinClass", criteria.cabinClass);
  return params.toString();
}

export type QuotePageSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function airportFromParams(iata: string | undefined, city: string | undefined, name: string | undefined, fallback: Airport): Airport {
  if (!iata) return fallback;
  return { ...fallback, iata, city: city ?? iata, name: name ?? iata };
}

/** Inverse of `buildQuoteQueryString` — reconstructs the criteria the
 * `/quote` page renders from, falling back to `DEFAULT_CRITERIA` field by
 * field so a partial or missing query string still produces a complete,
 * displayable result. */
export function parseQuoteQuery(searchParams: QuotePageSearchParams): QuoteCriteria {
  const tripTypeRaw = first(searchParams.tripType);
  const tripType: TripType =
    tripTypeRaw === "one-way" || tripTypeRaw === "multi-city" || tripTypeRaw === "round-trip"
      ? tripTypeRaw
      : DEFAULT_CRITERIA.tripType;

  const from = airportFromParams(
    first(searchParams.fromIata),
    first(searchParams.fromCity),
    first(searchParams.fromName),
    DEFAULT_CRITERIA.from,
  );
  const to = airportFromParams(
    first(searchParams.toIata),
    first(searchParams.toCity),
    first(searchParams.toName),
    DEFAULT_CRITERIA.to,
  );

  const passengersRaw = Number(first(searchParams.passengers));
  const passengers = Number.isFinite(passengersRaw) && passengersRaw > 0 ? passengersRaw : DEFAULT_CRITERIA.passengers;

  return {
    tripType,
    from,
    to,
    departure: first(searchParams.departure) ?? DEFAULT_CRITERIA.departure,
    returnDate: first(searchParams.returnDate) ?? DEFAULT_CRITERIA.returnDate,
    passengers,
    cabinClass: first(searchParams.cabinClass) || DEFAULT_CRITERIA.cabinClass,
  };
}
