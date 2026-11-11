"use client";

import { useState, type FormEvent } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/Button";

const DEFAULT_PHONE_NUMBER = "1869-504-657";

const FIELD_CLASSES =
  "w-full appearance-none rounded-input border border-navy-deep/10 bg-white px-4 py-3.5 text-[13px] leading-[18px] font-medium text-text-dark placeholder:text-text-gray placeholder:font-normal outline-none transition-all duration-200 hover:border-navy-deep/20 focus:border-emerald focus:shadow-[0_0_0_4px_rgba(0,182,122,0.12)]";

const FIELD_LABEL_CLASSES = "sr-only";

interface FormErrors {
  lastName?: string;
  bookingReference?: string;
}

export interface FlightServiceFormProps {
  /** A technical identifier (e.g. `"date_change"`), not page content —
   * becomes `FormSubmission.formType` and is hardcoded per page, not
   * CMS-editable (see `ServiceFormSectionData`'s doc comment). */
  serviceType: string;
  heading?: string;
  supportingText?: string;
  ctaLabel?: string;
  phoneNumber?: string;
  /** Renders just the `<form>` — no card/shadow wrapper, no heading or
   * supporting text — for embedding inside a hero that already supplies
   * its own card chrome (`MultiCityHero`'s quote card, in place of its
   * `FlightSearch` widget). `heading`/`supportingText` are ignored when
   * `bare` is set. */
  bare?: boolean;
}

/** The shared "Last Name + Booking Reference, then call" lead-capture card
 * reused across Flight Change, Missed Flight, Date Change, Schedule
 * Changes and Name Correction — one component, service-specific props,
 * same as `TestimonialCarousel`/`LightFaqSection` are reused across pages.
 * Deliberately not a multi-field quote request (see `QuoteForm`) — this is
 * a light pre-call qualifier, not a replacement for a human conversation,
 * so it never claims to look up or change an existing booking itself. */
export function FlightServiceForm({
  serviceType,
  heading,
  supportingText,
  ctaLabel = "Call a Flight Specialist",
  phoneNumber = DEFAULT_PHONE_NUMBER,
  bare = false,
}: FlightServiceFormProps) {
  const [lastName, setLastName] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!bookingReference.trim())
      nextErrors.bookingReference = "Booking reference or ticket number is required.";
    return nextErrors;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    // Fire-and-forget lead capture — the call itself never waits on this,
    // and the booking details travel only in this POST body, never in a
    // URL, so they can't leak via browser history or server access logs.
    fetch("/api/v1/form-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: serviceType,
        payload: {
          lastName: lastName.trim(),
          bookingReference: bookingReference.trim(),
          pageUrl: window.location.pathname,
        },
      }),
    }).catch(() => {
      // Best-effort only — a failed lead-capture write should never block
      // the one thing this form exists to do: get the visitor on a call.
    });

    window.location.href = `tel:${phoneNumber}`;
    setSubmitting(false);
  }

  const form = (
    <form onSubmit={handleSubmit} noValidate className={bare ? "space-y-3" : "mt-6 space-y-3"}>
      <div>
        <label className={FIELD_LABEL_CLASSES} htmlFor={`${serviceType}-last-name`}>
          Last Name
        </label>
        <input
          id={`${serviceType}-last-name`}
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          disabled={submitting}
          placeholder="Last Name"
          className={FIELD_CLASSES}
          aria-invalid={Boolean(errors.lastName)}
        />
        {errors.lastName ? (
          <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
        ) : null}
      </div>

      <div>
        <label className={FIELD_LABEL_CLASSES} htmlFor={`${serviceType}-booking-reference`}>
          Booking Reference / Ticket Number
        </label>
        <input
          id={`${serviceType}-booking-reference`}
          type="text"
          value={bookingReference}
          onChange={(event) => setBookingReference(event.target.value)}
          disabled={submitting}
          placeholder="Booking Reference / Ticket Number"
          className={FIELD_CLASSES}
          aria-invalid={Boolean(errors.bookingReference)}
        />
        {errors.bookingReference ? (
          <p className="mt-1 text-xs text-red-500">{errors.bookingReference}</p>
        ) : null}
      </div>

      <Button type="submit" variant="gold" className="w-full" disabled={submitting}>
        <Phone size={16} aria-hidden="true" />
        {ctaLabel}
      </Button>
    </form>
  );

  if (bare) return form;

  return (
    <div className="mx-auto w-full max-w-md rounded-card border border-navy-deep/10 bg-white p-6 shadow-card sm:p-8">
      <h3 className="text-xl text-navy-deep sm:text-2xl">{heading}</h3>
      <p
        className="mt-2 text-[13px] leading-[18px] text-text-gray"
        dangerouslySetInnerHTML={{ __html: supportingText ?? "" }}
      />
      {form}
    </div>
  );
}
