"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Loader2,
  Mail,
  MapPinned,
  Phone,
  Search,
  User,
  Users2,
} from "lucide-react";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { Button } from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
import type { Airport } from "@/lib/airportSearch";
import { toIsoDate } from "@/lib/dateUtils";

type TripType = "round-trip" | "one-way" | "multi-city";
type Step = "criteria" | "contact" | "success";

const TABS: { id: TripType; label: string }[] = [
  { id: "round-trip", label: "Round Trip" },
  { id: "one-way", label: "One Way" },
  { id: "multi-city", label: "Multi City" },
];

const CABIN_CLASSES = ["Economy", "Premium Economy", "Business", "First"];

const FIELD_CLASSES =
  "w-full appearance-none rounded-input border border-navy-deep/10 bg-gray-light py-3 pl-10 pr-3 text-sm font-medium text-text-dark outline-none transition-colors focus:border-emerald focus:bg-white";

const FIELD_LABEL_CLASSES = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-text-gray";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

interface ContactErrors {
  name?: string;
  email?: string;
  mobile?: string;
  city?: string;
}

const STEP_TRANSITION = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.2, ease: "easeOut" as const },
};

/**
 * The floating flight-search card, now a two-step lead-capture flow: Step 1
 * collects the flight criteria (unchanged from before), Step 2 asks for
 * contact details before actually submitting anything. The final submit
 * really persists to the database (`POST /api/v1/form-submissions`, backed
 * by the `FormSubmission` model) — there's still no live fare inventory
 * behind this, but the lead itself is real, not a no-op.
 */
export function FlightSearch() {
  const [step, setStep] = useState<Step>("criteria");

  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState("Business");
  const [dateError, setDateError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const todayIso = toIsoDate(new Date());

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function handleDepartureChange(iso: string) {
    setDeparture(iso);
    setDateError("");
    // Return can never precede Departure — if the newly picked Departure
    // date lands after the currently selected Return date, that Return
    // value is no longer valid, so clear it rather than silently keep an
    // impossible date around.
    if (returnDate && iso > returnDate) {
      setReturnDate("");
    }
  }

  function handleReturnChange(iso: string) {
    setReturnDate(iso);
    setDateError("");
  }

  function handleCriteriaSubmit(event: FormEvent) {
    event.preventDefault();

    // The custom DatePicker isn't a native input, so there's no built-in
    // "required" validation to lean on — check the same two fields the
    // native date inputs used to enforce.
    if (!departure || (tripType === "round-trip" && !returnDate)) {
      setDateError(
        tripType === "round-trip" && !returnDate
          ? "Please select both a departure and return date."
          : "Please select a departure date.",
      );
      return;
    }
    setDateError("");
    setStep("contact");
  }

  function validateContact(): ContactErrors {
    const errors: ContactErrors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address.";
    if (!mobile.trim()) errors.mobile = "Mobile number is required.";
    else if (!isValidPhone(mobile)) errors.mobile = "Enter a valid phone number.";
    if (!city.trim()) errors.city = "City is required.";
    return errors;
  }

  async function handleContactSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");

    const errors = validateContact();
    setContactErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/v1/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "flight_quote_request",
          name: name.trim(),
          email: email.trim(),
          phone: mobile.trim(),
          payload: {
            tripType,
            from,
            to,
            departure,
            returnDate: tripType === "round-trip" ? returnDate : null,
            passengers,
            cabinClass,
            contactCity: city.trim(),
          },
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        throw new Error(body?.error?.message ?? "Something went wrong. Please try again.");
      }

      setStep("success");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setStep("criteria");
    setTripType("round-trip");
    setFrom(null);
    setTo(null);
    setDeparture("");
    setReturnDate("");
    setPassengers(1);
    setCabinClass("Business");
    setName("");
    setEmail("");
    setMobile("");
    setCity("");
    setContactErrors({});
    setSubmitError("");
  }

  return (
    <div className="w-full rounded-card bg-white p-5 shadow-soft sm:p-7">
      {step !== "success" ? (
        <div className="mb-5 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold ${
                step === "criteria" ? "bg-navy-deep text-white" : "bg-emerald text-white"
              }`}
            >
              {step === "criteria" ? "1" : <Check size={12} aria-hidden="true" />}
            </span>
            <span className="text-xs font-semibold text-text-dark">Flight Details</span>
          </div>
          <span className="h-px w-8 bg-navy-deep/10" aria-hidden="true" />
          <div className="flex items-center gap-1.5">
            <span
              className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold ${
                step === "contact" ? "bg-navy-deep text-white" : "bg-gray-light text-text-gray"
              }`}
            >
              2
            </span>
            <span className={`text-xs font-semibold ${step === "contact" ? "text-text-dark" : "text-text-gray"}`}>
              Your Details
            </span>
          </div>
        </div>
      ) : null}

      {step === "criteria" ? (
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
      ) : null}

      <AnimatePresence mode="wait">
        {step === "criteria" ? (
          <motion.form
            key="criteria"
            {...STEP_TRANSITION}
            onSubmit={handleCriteriaSubmit}
            noValidate
            className="space-y-4"
          >
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

            <div
              className={`grid grid-cols-1 gap-3 ${tripType === "round-trip" ? "sm:grid-cols-2" : ""}`}
            >
              <DatePicker
                id="departure-date"
                label="Departure"
                value={departure}
                onChange={handleDepartureChange}
                min={todayIso}
                placeholder="Select date"
                align="start"
              />

              {tripType === "round-trip" ? (
                <DatePicker
                  id="return-date"
                  label="Return"
                  value={returnDate}
                  onChange={handleReturnChange}
                  min={departure || todayIso}
                  placeholder="Select date"
                  align="end"
                />
              ) : null}
            </div>

            {dateError ? <p className="text-xs font-medium text-red-500">{dateError}</p> : null}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={FIELD_LABEL_CLASSES} htmlFor="passengers">
                  Passengers
                </label>
                <div className="relative">
                  <Users2
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray"
                    aria-hidden="true"
                  />
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
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-gray"
                    aria-hidden="true"
                  />
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
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-gray"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              <Search size={16} aria-hidden="true" />
              Search Flights
            </Button>
          </motion.form>
        ) : step === "contact" ? (
          <motion.form
            key="contact"
            {...STEP_TRANSITION}
            onSubmit={handleContactSubmit}
            noValidate
            className="space-y-4"
          >
            <div className="rounded-input bg-gray-light px-4 py-3 text-xs text-text-gray">
              <span className="font-semibold text-text-dark">
                {from ? `${from.city} (${from.iata})` : "—"} <ArrowLeftRight size={11} className="mx-1 inline" aria-hidden="true" />{" "}
                {to ? `${to.city} (${to.iata})` : "—"}
              </span>
              <br />
              {departure} {tripType === "round-trip" && returnDate ? `– ${returnDate}` : ""} · {passengers}{" "}
              {passengers === 1 ? "Passenger" : "Passengers"} · {cabinClass}
            </div>

            <div>
              <label className={FIELD_LABEL_CLASSES} htmlFor="contact-name">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray" aria-hidden="true" />
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={submitting}
                  placeholder="Your full name"
                  className={FIELD_CLASSES}
                  aria-invalid={Boolean(contactErrors.name)}
                />
              </div>
              {contactErrors.name ? <p className="mt-1 text-xs text-red-500">{contactErrors.name}</p> : null}
            </div>

            <div>
              <label className={FIELD_LABEL_CLASSES} htmlFor="contact-email">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray" aria-hidden="true" />
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={submitting}
                  placeholder="you@example.com"
                  className={FIELD_CLASSES}
                  aria-invalid={Boolean(contactErrors.email)}
                />
              </div>
              {contactErrors.email ? <p className="mt-1 text-xs text-red-500">{contactErrors.email}</p> : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={FIELD_LABEL_CLASSES} htmlFor="contact-mobile">
                  Mobile
                </label>
                <div className="relative">
                  <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray" aria-hidden="true" />
                  <input
                    id="contact-mobile"
                    type="tel"
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    disabled={submitting}
                    placeholder="+1 555 123 4567"
                    className={FIELD_CLASSES}
                    aria-invalid={Boolean(contactErrors.mobile)}
                  />
                </div>
                {contactErrors.mobile ? <p className="mt-1 text-xs text-red-500">{contactErrors.mobile}</p> : null}
              </div>

              <div>
                <label className={FIELD_LABEL_CLASSES} htmlFor="contact-city">
                  City
                </label>
                <div className="relative">
                  <MapPinned size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray" aria-hidden="true" />
                  <input
                    id="contact-city"
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    disabled={submitting}
                    placeholder="Your city"
                    className={FIELD_CLASSES}
                    aria-invalid={Boolean(contactErrors.city)}
                  />
                </div>
                {contactErrors.city ? <p className="mt-1 text-xs text-red-500">{contactErrors.city}</p> : null}
              </div>
            </div>

            {submitError ? <p className="text-xs font-medium text-red-500">{submitError}</p> : null}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("criteria")}
                disabled={submitting}
                className="rounded-btn border border-navy-deep/10 px-5 py-3 text-sm font-semibold text-text-dark transition-colors hover:bg-gray-light disabled:opacity-50"
              >
                Back
              </button>
              <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  "Get My Quote"
                )}
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div key="success" {...STEP_TRANSITION} className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-emerald/10 text-emerald">
              <Check size={28} aria-hidden="true" />
            </span>
            <h3 className="font-heading text-lg font-bold text-text-dark">Request Received!</h3>
            <p className="max-w-xs text-sm text-text-gray">
              Thanks, {name.split(" ")[0] || "there"} — one of our travel experts will reach out to{" "}
              {email || "your email"} shortly with the best fares for your trip.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="mt-2 text-sm font-semibold text-emerald transition-colors hover:text-emerald-bright"
            >
              Search Another Flight
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
