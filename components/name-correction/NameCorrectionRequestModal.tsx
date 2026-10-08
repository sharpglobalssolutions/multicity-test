"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { Button } from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Airport } from "@/lib/airportSearch";
import { toIsoDate } from "@/lib/dateUtils";
import { CABIN_CLASSES } from "@/lib/flightSearchTypes";

const FIELD_CLASSES =
  "w-full rounded-input border border-navy-deep/10 bg-white px-4 py-3 text-sm font-medium text-text-dark outline-none transition-all duration-200 hover:border-navy-deep/20 focus:border-emerald focus:shadow-[0_0_0_4px_rgba(0,182,122,0.12)]";
const FIELD_LABEL_CLASSES = "mb-2 block text-[11px] font-bold uppercase tracking-wider text-navy-deep";

const NAME_ISSUE_TYPES = [
  "Minor spelling mistake",
  "Missing middle name",
  "Passport name mismatch",
  "Married surname update",
  "Divorce-related surname update",
  "Typographical error",
  "Reversed first and last names",
  "Incorrect title or initials",
  "Other",
];

export interface NameCorrectionRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
  disclaimer?: string;
}

/** The "Request Flight Name Correction Assistance" enquiry form, as a
 * modal opened by `NameCorrectionCenteredCta`'s button — same
 * `DateChangeRequestModal`/`PersonalizedQuoteModal` pattern (Base UI
 * `Dialog`, an inert `initialFocusRef` panel so opening the modal doesn't
 * immediately pop the first autocomplete field's suggestions). Submits a
 * real `name_correction_assistance_request` row to
 * `/api/v1/form-submissions`, same backend every other form on the site
 * uses — never a UI-only mock. All copy props optional, falling back to
 * the current hardcoded default — see `Hero.tsx` for the rationale. */
export function NameCorrectionRequestModal({
  open,
  onOpenChange,
  heading = "Request Flight Name Correction Assistance",
  subheading = "Tell Us About Your Booking",
  buttonLabel = "Review My Name Correction Options",
  disclaimer = "Please do not submit sensitive documents unless requested through an appropriate secure channel.",
}: NameCorrectionRequestModalProps) {
  const initialFocusRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [airline, setAirline] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [cabinClass, setCabinClass] = useState("Business");
  const [nameIssueType, setNameIssueType] = useState(NAME_ISSUE_TYPES[0]);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const todayIso = toIsoDate(new Date());

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      // Reset so the next open starts fresh rather than showing the last
      // submission's success state or stale field values.
      setTimeout(() => {
        setName("");
        setEmail("");
        setPhone("");
        setAirline("");
        setBookingReference("");
        setDepartureDate("");
        setOrigin(null);
        setDestination(null);
        setCabinClass("Business");
        setNameIssueType(NAME_ISSUE_TYPES[0]);
        setAdditionalDetails("");
        setStatus("idle");
        setError("");
      }, 200);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const response = await fetch("/api/v1/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "name_correction_assistance_request",
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          payload: {
            airline,
            bookingReference,
            departureDate,
            origin,
            destination,
            cabinClass,
            nameIssueType,
            additionalDetails,
          },
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        initialFocus={initialFocusRef}
        className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto rounded-[20px] bg-white p-0 ring-1 ring-navy-deep/10 sm:max-w-2xl"
      >
        <div ref={initialFocusRef} tabIndex={-1} className="p-6 outline-none sm:p-10">
          {status === "success" ? (
            <div className="py-6 text-center">
              <h2 className="text-2xl text-text-dark">Thank You</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-text-gray">
                We&apos;ve received your enquiry. A travel specialist will review your booking and get in touch to
                help you understand your name correction options.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl text-text-dark sm:text-[28px]">{heading}</h2>
              <p className="mt-2 text-[15px] font-semibold text-text-gray">{subheading}</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="nc-name">
                      Your Name
                    </label>
                    <input
                      id="nc-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className={FIELD_CLASSES}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="nc-email">
                      Email Address
                    </label>
                    <input
                      id="nc-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={FIELD_CLASSES}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="nc-phone">
                      Phone Number
                    </label>
                    <input
                      id="nc-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className={FIELD_CLASSES}
                      placeholder="+1 555 123 4567"
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="nc-airline">
                      Airline
                    </label>
                    <input
                      id="nc-airline"
                      type="text"
                      value={airline}
                      onChange={(event) => setAirline(event.target.value)}
                      className={FIELD_CLASSES}
                      placeholder="e.g. British Airways"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="nc-booking-ref">
                      Booking Reference
                    </label>
                    <input
                      id="nc-booking-ref"
                      type="text"
                      value={bookingReference}
                      onChange={(event) => setBookingReference(event.target.value)}
                      className={FIELD_CLASSES}
                      placeholder="If available"
                    />
                  </div>
                  <DatePicker
                    id="nc-departure-date"
                    label="Departure Date"
                    value={departureDate}
                    onChange={setDepartureDate}
                    min={todayIso}
                    placeholder="Departure date"
                    align="end"
                    labelClassName={FIELD_LABEL_CLASSES}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <AirportAutocomplete
                    label="Origin"
                    value={origin}
                    onChange={setOrigin}
                    placeholder="Departure city or airport"
                    labelClassName={FIELD_LABEL_CLASSES}
                  />
                  <AirportAutocomplete
                    label="Destination"
                    value={destination}
                    onChange={setDestination}
                    placeholder="Destination city or airport"
                    labelClassName={FIELD_LABEL_CLASSES}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={FIELD_LABEL_CLASSES} htmlFor="nc-cabin">
                      Cabin Class
                    </label>
                    <select
                      id="nc-cabin"
                      value={cabinClass}
                      onChange={(event) => setCabinClass(event.target.value)}
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
                    <label className={FIELD_LABEL_CLASSES} htmlFor="nc-issue-type">
                      Type of Name Issue
                    </label>
                    <select
                      id="nc-issue-type"
                      value={nameIssueType}
                      onChange={(event) => setNameIssueType(event.target.value)}
                      className={FIELD_CLASSES}
                    >
                      {NAME_ISSUE_TYPES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={FIELD_LABEL_CLASSES} htmlFor="nc-details">
                    Additional Details
                  </label>
                  <textarea
                    id="nc-details"
                    value={additionalDetails}
                    onChange={(event) => setAdditionalDetails(event.target.value)}
                    rows={4}
                    className={FIELD_CLASSES}
                    placeholder="Anything else we should know?"
                  />
                </div>

                {status === "error" ? <p className="text-sm font-medium text-red-500">{error}</p> : null}

                <div>
                  <Button type="submit" variant="gold" disabled={status === "submitting"} className="w-full sm:w-auto">
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

                <p className="text-xs text-text-gray">{disclaimer}</p>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
