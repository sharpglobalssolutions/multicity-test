export type TripType = "round-trip" | "one-way" | "multi-city";

export const TRIP_TYPE_TABS: { id: TripType; label: string }[] = [
  { id: "round-trip", label: "Round Trip" },
  { id: "one-way", label: "One Way" },
  { id: "multi-city", label: "Multi City" },
];

export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  "round-trip": "Round Trip",
  "one-way": "One Way",
  "multi-city": "Multi City",
};

export const CABIN_CLASSES = ["Economy", "Premium Economy", "Business", "First"];
