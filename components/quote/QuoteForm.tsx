"use client";

import { useState, type FormEvent } from "react";
import { Armchair, Check, ChevronDown, Loader2, Mail, Phone, User, Users2 } from "lucide-react";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { Button } from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
import type { Airport } from "@/lib/airportSearch";
import { toIsoDate } from "@/lib/dateUtils";
import { CABIN_CLASSES, TRIP_TYPE_TABS, type TripType } from "@/lib/flightSearchTypes";
import type { QuoteCriteria } from "@/lib/quoteQuery";

const CONTACT_PHONE_HREF = "tel:1869-504-657";
const CONTACT_PHONE_LABEL = "1869-504-657";

// A brighter value color than the site's plain `text-text-dark` — reuses
// the same secondary brand blue already used for the header's CTA and
// `FlightSearch.tsx`'s active trip-type pill, rather than introducing a
// new color, so filled-in fields read as a bit more "alive" instead of
// flat near-black.
const FIELD_VALUE_COLOR = "text-[#0a4074]";

// `::placeholder` inherits an input's `color` at reduced opacity by
// default — pinned to `text-text-gray` explicitly so a brighter value
// color never tints the empty-state placeholder too.
const FIELD_CLASSES = `w-full appearance-none rounded-input border border-navy-deep/10 bg-white py-3.5 pl-12 pr-3 text-[15px] font-medium ${FIELD_VALUE_COLOR} placeholder:text-text-gray placeholder:font-normal outline-none transition-all duration-200 hover:border-navy-deep/20 focus:border-emerald focus:shadow-[0_0_0_4px_rgba(0,182,122,0.12)]`;

// Visually hidden, not removed — the `<label htmlFor>` association is
// still every one of these fields' accessible name. Fields-only is a
// presentational choice; screen-reader users still need a name.
const FIELD_LABEL_CLASSES = "sr-only";

const FIELD_ICON_WRAP_CLASSES =
  "pointer-events-none absolute left-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-navy-deep/5 text-navy-deep";

// The Passengers/Class pair reads as one combined field (per the reference
// layout) rather than two bordered selects side by side — a single
// container carries the border, split by one divider, and each `<select>`
// inside goes borderless/transparent so it doesn't double up. Every pixel
// of width matters here (this field is already sharing a row), so the
// leading icon skips the circular-chip treatment other fields use and the
// horizontal padding stays as tight as still-comfortable tap targets allow.
const GROUPED_SELECT_CLASSES = `w-full appearance-none bg-transparent py-3.5 pl-7 pr-5 text-[14px] font-medium ${FIELD_VALUE_COLOR} outline-none`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

const TRUST_ITEMS = [
  { value: "100%", label: "Safe & Secure" },
  { value: "250K+", label: "Travellers Served" },
  { value: "24/7", label: "Concierge Support" },
];

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export interface QuoteFormProps {
  criteria: QuoteCriteria;
  /** `/quote`'s own spec asked for a green phone bar; the Business Class
   * hero (`BusinessClassHero.tsx`) asked for the same dark navy used
   * elsewhere in the brand, with the phone icon in a white circular badge
   * instead of bare on the green fill — this is the one part of the form
   * two pages disagreed on, so it's the one thing made a prop rather than
   * hardcoded either way. */
  phoneBarVariant?: "green" | "navy";
}

/** The lead-capture form on `/quote` — pre-filled from the criteria the
 * visitor already entered in the homepage `FlightSearch` widget, but fully
 * editable. Submits to the same `/api/v1/form-submissions` endpoint (same
 * `formType`/`payload` shape) that used to be reached from `FlightSearch`'s
 * inline "contact" step. */
export function QuoteForm({ criteria, phoneBarVariant = "green" }: QuoteFormProps) {
  const [tripType, setTripType] = useState<TripType>(criteria.tripType);
  const [from, setFrom] = useState<Airport | null>(criteria.from);
  const [to, setTo] = useState<Airport | null>(criteria.to);
  const [departure, setDeparture] = useState(criteria.departure);
  const [returnDate, setReturnDate] = useState(criteria.returnDate);
  const [passengers, setPassengers] = useState(criteria.passengers);
  const [cabinClass, setCabinClass] = useState(criteria.cabinClass);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const todayIso = toIsoDate(new Date());

  function handleDepartureChange(iso: string) {
    setDeparture(iso);
    if (returnDate && iso > returnDate) setReturnDate("");
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required.";
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!phone.trim()) nextErrors.phone = "Phone number is required.";
    else if (!isValidPhone(phone)) nextErrors.phone = "Enter a valid phone number.";
    return nextErrors;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/v1/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "flight_quote_request",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          payload: {
            tripType,
            from,
            to,
            departure,
            returnDate: tripType === "round-trip" ? returnDate : null,
            passengers,
            cabinClass,
          },
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 border border-navy-deep/10 bg-white p-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald/10 text-emerald">
          <Check size={28} aria-hidden="true" />
        </span>
        <h3 className="font-heading text-lg font-bold text-text-dark">Request Received!</h3>
        <p className="max-w-xs text-sm text-text-gray">
          Thanks, {name.split(" ")[0] || "there"} — one of our travel experts will reach out to{" "}
          {email || "your email"} shortly with the best fares for your trip.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-navy-deep/10 bg-white p-6 sm:p-8">
      {phoneBarVariant === "navy" ? (
        <a
          href={CONTACT_PHONE_HREF}
          className="flex h-[70px] items-center justify-center gap-3 rounded-input bg-navy-deep px-6 text-center text-lg font-bold text-white transition-colors hover:bg-navy-dark sm:text-xl"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-navy-deep">
            <Phone size={16} aria-hidden="true" />
          </span>
          {CONTACT_PHONE_LABEL}
        </a>
      ) : (
        <a
          href={CONTACT_PHONE_HREF}
          className="flex h-[70px] items-center justify-center gap-2 rounded-input bg-emerald px-6 text-center text-lg font-bold text-white transition-colors hover:bg-emerald-bright sm:text-xl"
        >
          <Phone size={20} aria-hidden="true" />
          {CONTACT_PHONE_LABEL}
        </a>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.3fr]">
          <div>
            <label className={FIELD_LABEL_CLASSES} htmlFor="quote-trip-type">
              Trip Type
            </label>
            <div className="relative">
              <select
                id="quote-trip-type"
                value={tripType}
                onChange={(event) => setTripType(event.target.value as TripType)}
                className={`${FIELD_CLASSES} pl-4 pr-8`}
              >
                {TRIP_TYPE_TABS.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-gray"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <label className={FIELD_LABEL_CLASSES} htmlFor="quote-passengers">
              Passengers / Class
            </label>
            <div className="grid grid-cols-[1fr_1.15fr] divide-x divide-navy-deep/10 rounded-input border border-navy-deep/10 bg-white transition-colors hover:border-navy-deep/20">
              <div className="relative">
                <Users2
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-deep/60"
                  aria-hidden="true"
                />
                <select
                  id="quote-passengers"
                  value={passengers}
                  onChange={(event) => setPassengers(Number(event.target.value))}
                  className={GROUPED_SELECT_CLASSES}
                >
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((count) => (
                    <option key={count} value={count}>
                      {count} Pax
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-text-gray"
                  aria-hidden="true"
                />
              </div>

              <div className="relative">
                <Armchair
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-deep/60"
                  aria-hidden="true"
                />
                <select
                  id="quote-cabin-class"
                  aria-label="Class"
                  value={cabinClass}
                  onChange={(event) => setCabinClass(event.target.value)}
                  className={GROUPED_SELECT_CLASSES}
                >
                  {CABIN_CLASSES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-text-gray"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AirportAutocomplete
            label="From"
            value={from}
            onChange={setFrom}
            placeholder="From"
            hideLabel
            valueClassName={FIELD_VALUE_COLOR}
          />
          <AirportAutocomplete
            label="To"
            value={to}
            onChange={setTo}
            placeholder="To"
            hideLabel
            valueClassName={FIELD_VALUE_COLOR}
          />
        </div>

        <div className={`grid grid-cols-1 gap-3 ${tripType === "round-trip" ? "sm:grid-cols-2" : ""}`}>
          <DatePicker
            id="quote-departure-date"
            label="Departure Date"
            value={departure}
            onChange={handleDepartureChange}
            min={todayIso}
            placeholder="Departure date"
            align="start"
            hideLabel
            valueClassName={FIELD_VALUE_COLOR}
          />
          {tripType === "round-trip" ? (
            <DatePicker
              id="quote-return-date"
              label="Return Date"
              value={returnDate}
              onChange={setReturnDate}
              min={departure || todayIso}
              placeholder="Return date"
              align="end"
              hideLabel
              valueClassName={FIELD_VALUE_COLOR}
            />
          ) : null}
        </div>

        <div>
          <label className={FIELD_LABEL_CLASSES} htmlFor="quote-email">
            Email
          </label>
          <div className="relative">
            <span className={FIELD_ICON_WRAP_CLASSES}>
              <Mail size={14} aria-hidden="true" />
            </span>
            <input
              id="quote-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
              placeholder="you@example.com"
              className={FIELD_CLASSES}
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={FIELD_LABEL_CLASSES} htmlFor="quote-phone">
              Phone Number
            </label>
            <div className="relative">
              <span className={FIELD_ICON_WRAP_CLASSES}>
                <Phone size={14} aria-hidden="true" />
              </span>
              <input
                id="quote-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={submitting}
                placeholder="+1 555 123 4567"
                className={FIELD_CLASSES}
                aria-invalid={Boolean(errors.phone)}
              />
            </div>
            {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
          </div>

          <div>
            <label className={FIELD_LABEL_CLASSES} htmlFor="quote-name">
              Name
            </label>
            <div className="relative">
              <span className={FIELD_ICON_WRAP_CLASSES}>
                <User size={14} aria-hidden="true" />
              </span>
              <input
                id="quote-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={submitting}
                placeholder="Your full name"
                className={FIELD_CLASSES}
                aria-invalid={Boolean(errors.name)}
              />
            </div>
            {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
          </div>
        </div>

        {submitError ? <p className="text-xs font-medium text-red-500">{submitError}</p> : null}

        <Button type="submit" variant="gold" className="h-[58px] w-full text-base uppercase" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            "Get Free Quotes"
          )}
        </Button>

        <div className="grid grid-cols-3 divide-x divide-navy-deep/10 pt-4 text-center">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label}>
              <p className="text-lg text-navy-deep sm:text-[22px]">{item.value}</p>
              <p className="mt-1 text-[9px]  uppercase leading-tight tracking-wide text-text-gray sm:text-[14px]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
