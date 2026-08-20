export interface Airport {
  iata: string;
  icao: string | null;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

export type AirportMatchField = "iata" | "name" | "city" | "country";

export interface AirportSearchResult extends Airport {
  matchField: AirportMatchField;
}

let cachedAirports: Airport[] | null = null;
let loadPromise: Promise<Airport[]> | null = null;

/**
 * Loads the airport dataset from `/airports.json` (served as a static
 * asset, not imported as a JS module) and caches it in memory. At ~950KB
 * this is too large to bundle into the page's JS — importing it directly
 * would have shipped it as parse-blocking JavaScript to every visitor
 * whether or not they ever touch the flight search fields. Fetching it
 * lazily (and letting the browser cache the response) keeps it off the
 * critical path entirely until the user actually needs it.
 */
export function loadAirports(): Promise<Airport[]> {
  if (cachedAirports) return Promise.resolve(cachedAirports);
  if (!loadPromise) {
    loadPromise = fetch("/airports.json")
      .then((response) => response.json() as Promise<Airport[]>)
      .then((data) => {
        cachedAirports = data;
        return data;
      })
      .catch((error) => {
        loadPromise = null;
        throw error;
      });
  }
  return loadPromise;
}

/**
 * Ranks airports for a query in the priority order the search box
 * promises: exact IATA code, then IATA/name/city prefix matches, then
 * country prefix, then substring matches anywhere in name/city/country.
 * Case-insensitive throughout.
 */
export async function searchAirports(query: string, limit = 8): Promise<AirportSearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const airports = await loadAirports();
  const scored: { airport: Airport; score: number; matchField: AirportMatchField }[] = [];

  for (const airport of airports) {
    const iataLower = airport.iata.toLowerCase();
    const nameLower = airport.name.toLowerCase();
    const cityLower = airport.city.toLowerCase();
    const countryLower = airport.country.toLowerCase();

    let score = -1;
    let matchField: AirportMatchField = "name";

    if (iataLower === q) {
      score = 100;
      matchField = "iata";
    } else if (iataLower.startsWith(q)) {
      score = 90;
      matchField = "iata";
    } else if (nameLower.startsWith(q)) {
      score = 80;
      matchField = "name";
    } else if (cityLower.startsWith(q)) {
      score = 75;
      matchField = "city";
    } else if (countryLower.startsWith(q)) {
      score = 60;
      matchField = "country";
    } else if (nameLower.includes(q)) {
      score = 50;
      matchField = "name";
    } else if (cityLower.includes(q)) {
      score = 45;
      matchField = "city";
    } else if (countryLower.includes(q)) {
      score = 30;
      matchField = "country";
    }

    if (score >= 0) {
      scored.push({ airport, score, matchField });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.airport.name.localeCompare(b.airport.name));

  return scored.slice(0, limit).map(({ airport, matchField }) => ({ ...airport, matchField }));
}

/** Primary airport for each city already featured in the deals/destinations
 * content (`data/content.ts`) — shown as suggestions before the user has
 * typed anything, so clicking an empty From/To field isn't a dead end. */
const POPULAR_IATA_CODES = ["JFK", "LHR", "CDG", "DXB", "SIN", "NRT", "HKG", "SYD"] as const;

/** Looks up `POPULAR_IATA_CODES` in the loaded dataset, preserving that
 * order, and silently skipping any code the dataset doesn't have. */
export async function getPopularAirports(): Promise<Airport[]> {
  const airports = await loadAirports();
  const byIata = new Map(airports.map((airport) => [airport.iata, airport]));
  return POPULAR_IATA_CODES.map((code) => byIata.get(code)).filter((airport): airport is Airport => Boolean(airport));
}

export interface TextSegment {
  text: string;
  match: boolean;
}

/** Splits `text` around the first case-insensitive occurrence of `query`,
 * so a component can render the matched substring highlighted. */
export function highlightSegments(text: string, query: string): TextSegment[] {
  const trimmed = query.trim();
  if (!trimmed) return [{ text, match: false }];

  const idx = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (idx === -1) return [{ text, match: false }];

  const segments: TextSegment[] = [
    { text: text.slice(0, idx), match: false },
    { text: text.slice(idx, idx + trimmed.length), match: true },
    { text: text.slice(idx + trimmed.length), match: false },
  ];

  return segments.filter((segment) => segment.text.length > 0);
}
