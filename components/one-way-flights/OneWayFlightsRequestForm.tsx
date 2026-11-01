"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { Button } from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
import { SectionReveal } from "@/components/SectionReveal";
import type { Airport } from "@/lib/airportSearch";
import { toIsoDate } from "@/lib/dateUtils";
import { CABIN_CLASSES } from "@/lib/flightSearchTypes";

const TRIP_TYPES = ["One-Way", "Open-Jaw", "Multi-City", "Not Sure — Please Advise"] as const;
type TripType = (typeof TRIP_TYPES)[number];

const CONTACT_METHODS = ["Email", "Phone", "Either"] as const;
type ContactMethod = (typeof CONTACT_METHODS)[number];

const FIELD_CLASSES =
  "w-full rounded-input border border-navy-deep/10 bg-white px-4 py-3 text-sm font-medium text-text-dark outline-none transition-all duration-200 hover:border-navy-deep/20 focus:border-emerald focus:shadow-[0_0_0_4px_rgba(0,182,122,0.12)]";
const FIELD_LABEL_CLASSES =
  "mb-2 block text-[11px] font-bold uppercase tracking-wider text-navy-deep";

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  name: string;
}) {
  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label={name}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={`rounded-btn border px-5 py-2.5 text-sm transition-colors ${
            value === option
              ? "border-emerald bg-emerald text-white"
              : "border-navy-deep/15 text-text-dark hover:border-navy-deep/30"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function StepHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-deep text-sm font-semibold text-white">
        {number}
      </span>
      <h3 className="text-lg text-text-dark sm:text-xl">{title}</h3>
    </div>
  );
}

export interface OneWayFlightsRequestFormProps {
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
}

/** The "Let's Plan Your International Journey" lead form, rendered inline
 * as a page section (not a modal) — the source content presents it as its
 * own four-step block on the page, not something a button pops open, so
 * it's its own component rather than reusing the
 * `DateChangeRequestModal`/`NameCorrectionRequestModal` dialog pattern.
 * Submits a real `one_way_flights_request` row to
 * `/api/v1/form-submissions`, same backend every other form on the site
 * uses. All copy props optional, falling back to the current hardcoded
 * default — see `Hero.tsx` for the rationale. */
export function OneWayFlightsRequestForm({
  heading = "Let's Plan Your International Journey",
  subheading = "You don't need to have every detail figured out before reaching out.",
  buttonLabel = "Request My Personalised Itinerary",
}: OneWayFlightsRequestFormProps = {}) {
  const [departureCity, setDepartureCity] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [flexibleDate, setFlexibleDate] = useState<"Yes" | "No">("No");
  const [travellers, setTravellers] = useState(1);

  const [primaryDestination, setPrimaryDestination] = useState<Airport | null>(null);
  const [additionalCities, setAdditionalCities] = useState("");
  const [finishCity, setFinishCity] = useState<Airport | null>(null);
  const [notSureFinish, setNotSureFinish] = useState(false);

  const [tripType, setTripType] = useState<TripType>("Not Sure — Please Advise");
  const [cabin, setCabin] = useState("Business");
  const [preferredAirline, setPreferredAirline] = useState("");
  const [flexibleFare, setFlexibleFare] = useState<"Yes" | "No" | "Unsure">("Unsure");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredContact, setPreferredContact] = useState<ContactMethod>("Email");
  const [additionalRequests, setAdditionalRequests] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const todayIso = toIsoDate(new Date());

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const response = await fetch("/api/v1/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "one_way_flights_request",
          name: [firstName, lastName].filter(Boolean).join(" ") || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          payload: {
            departureCity,
            departureDate,
            flexibleDate: flexibleDate === "Yes",
            travellers,
            primaryDestination,
            additionalCities,
            finishCity: notSureFinish ? null : finishCity,
            notSureFinish,
            tripType,
            cabin,
            preferredAirline,
            flexibleFare,
            firstName,
            lastName,
            preferredContact,
            additionalRequests,
          },
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        throw new Error(body?.error?.message ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <section id="connect" className="bg-white py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[28px] leading-[32px] text-text-dark">{heading}</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <SectionReveal
          delay={0.1}
          className="mx-auto mt-12 max-w-3xl rounded-card bg-gray-light p-6 sm:p-10"
        >
          {status === "success" ? (
            <div className="py-6 text-center">
              <h3 className="text-2xl text-text-dark">Thank You</h3>
              <p className="mt-3 text-[13px] leading-[18px] text-text-gray">
                We&apos;ve received your journey details. A travel specialist will
                be in touch to help you explore suitable one-way, open-jaw or
                multi-city options.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-5">
                <StepHeading number={1} title="Where Does Your Journey Begin?" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <AirportAutocomplete
                    label="Departure City / Airport"
                    value={departureCity}
                    onChange={setDepartureCity}
                    placeholder="Departure city or airport"
                    labelClassName={FIELD_LABEL_CLASSES}
                  />
                  <DatePicker
                    id="owf-departure-date"
                    label="Departure Date"
                    value={departureDate}
                    onChange={setDepartureDate}
                    min={todayIso}
                    placeholder="Departure date"
                    align="start"
                    labelClassName={FIELD_LABEL_CLASSES}
                  />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <span className={FIELD_LABEL_CLASSES}>Flexible Date?</span>
                    <ToggleGroup
                      name="Flexible date"
                      options={["Yes", "No"] as const}
                      value={flexibleDate}
                      onChange={setFlexibleDate}
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="owf-travellers">
                      Number of Travellers
                    </label>
                    <select
                      id="owf-travellers"
                      value={travellers}
                      onChange={(event) => setTravellers(Number(event.target.value))}
                      className={FIELD_CLASSES}
                    >
                      {Array.from({ length: 9 }, (_, i) => i + 1).map((count) => (
                        <option key={count} value={count}>
                          {count} {count === 1 ? "Traveller" : "Travellers"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-5 border-t border-navy-deep/10 pt-8">
                <StepHeading number={2} title="Where Are You Travelling?" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <AirportAutocomplete
                    label="Primary Destination"
                    value={primaryDestination}
                    onChange={setPrimaryDestination}
                    placeholder="Primary destination"
                    labelClassName={FIELD_LABEL_CLASSES}
                  />
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="owf-additional-cities">
                      Additional Cities or Countries
                    </label>
                    <input
                      id="owf-additional-cities"
                      type="text"
                      value={additionalCities}
                      onChange={(event) => setAdditionalCities(event.target.value)}
                      className={FIELD_CLASSES}
                      placeholder="e.g. Paris, Rome, Amsterdam"
                    />
                  </div>
                </div>
                <div>
                  <AirportAutocomplete
                    label="Where Will Your Journey Finish?"
                    value={finishCity}
                    onChange={setFinishCity}
                    placeholder={notSureFinish ? "Not sure yet" : "Final departure city or airport"}
                    labelClassName={FIELD_LABEL_CLASSES}
                  />
                  <label className="mt-2 flex items-center gap-2 text-[13px] text-text-gray">
                    <input
                      type="checkbox"
                      checked={notSureFinish}
                      onChange={(event) => {
                        setNotSureFinish(event.target.checked);
                        if (event.target.checked) setFinishCity(null);
                      }}
                      className="size-4 rounded border-navy-deep/20 text-emerald focus:ring-emerald"
                    />
                    Not sure yet
                  </label>
                </div>
              </div>

              <div className="space-y-5 border-t border-navy-deep/10 pt-8">
                <StepHeading number={3} title="How Would You Like to Travel?" />
                <div>
                  <span className={FIELD_LABEL_CLASSES}>Trip Type</span>
                  <ToggleGroup
                    name="Trip type"
                    options={TRIP_TYPES}
                    value={tripType}
                    onChange={setTripType}
                  />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="owf-cabin">
                      Cabin
                    </label>
                    <select
                      id="owf-cabin"
                      value={cabin}
                      onChange={(event) => setCabin(event.target.value)}
                      className={FIELD_CLASSES}
                    >
                      {CABIN_CLASSES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="owf-airline">
                      Preferred Airline (Optional)
                    </label>
                    <input
                      id="owf-airline"
                      type="text"
                      value={preferredAirline}
                      onChange={(event) => setPreferredAirline(event.target.value)}
                      className={FIELD_CLASSES}
                      placeholder="e.g. British Airways"
                    />
                  </div>
                </div>
                <div>
                  <span className={FIELD_LABEL_CLASSES}>Flexible Fare Required?</span>
                  <ToggleGroup
                    name="Flexible fare required"
                    options={["Yes", "No", "Unsure"] as const}
                    value={flexibleFare}
                    onChange={setFlexibleFare}
                  />
                </div>
              </div>

              <div className="space-y-5 border-t border-navy-deep/10 pt-8">
                <StepHeading number={4} title="Contact Details" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="owf-first-name">
                      First Name
                    </label>
                    <input
                      id="owf-first-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className={FIELD_CLASSES}
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="owf-last-name">
                      Last Name
                    </label>
                    <input
                      id="owf-last-name"
                      type="text"
                      required
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className={FIELD_CLASSES}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="owf-email">
                      Email
                    </label>
                    <input
                      id="owf-email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={FIELD_CLASSES}
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="owf-phone">
                      Phone
                    </label>
                    <input
                      id="owf-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className={FIELD_CLASSES}
                    />
                  </div>
                </div>
                <div>
                  <span className={FIELD_LABEL_CLASSES}>Preferred Contact Method</span>
                  <ToggleGroup
                    name="Preferred contact method"
                    options={CONTACT_METHODS}
                    value={preferredContact}
                    onChange={setPreferredContact}
                  />
                </div>
                <div>
                  <label className={FIELD_LABEL_CLASSES} htmlFor="owf-requests">
                    Additional Travel Requests
                  </label>
                  <textarea
                    id="owf-requests"
                    value={additionalRequests}
                    onChange={(event) => setAdditionalRequests(event.target.value)}
                    rows={4}
                    className={FIELD_CLASSES}
                    placeholder="Anything else we should know?"
                  />
                </div>
              </div>

              {status === "error" ? (
                <p className="text-sm font-medium text-red-500">{error}</p>
              ) : null}

              <div className="border-t border-navy-deep/10 pt-8">
                <Button
                  type="submit"
                  variant="gold"
                  disabled={status === "submitting"}
                  className="w-full sm:w-auto"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      {buttonLabel}
                      <ArrowRight size={16} aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </SectionReveal>
      </div>
    </section>
  );
}
