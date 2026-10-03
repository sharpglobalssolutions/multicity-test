"use client";

import { useId, useRef, useState, type ReactNode, type FormEvent } from "react";
import Image from "next/image";
import {
  ArrowLeftRight,
  ArrowRight,
  Armchair,
  BedDouble,
  Calendar,
  CalendarOff,
  Car,
  Check,
  Crown,
  Gift,
  Headset,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { AirportAutocomplete } from "@/components/AirportAutocomplete";
import { Button } from "@/components/Button";
import { DatePicker } from "@/components/DatePicker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Airport } from "@/lib/airportSearch";
import type { TripType } from "@/lib/flightSearchTypes";
import { unsplash } from "@/lib/images";

const FIELD_CLASSES =
  "w-full appearance-none rounded-input border border-navy-deep/10 bg-white py-3 pl-11 pr-3 text-sm font-medium text-text-dark outline-none transition-all duration-200 placeholder:text-text-gray placeholder:font-normal hover:border-navy-deep/20 focus:border-gold focus:shadow-[0_0_0_4px_rgba(181,150,85,0.15)]";

const FIELD_ICON_CLASSES =
  "pointer-events-none absolute left-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-navy-deep/5 text-navy-deep";

const FIELD_LABEL_CLASSES = "mb-2 block text-[13px] font-semibold text-text-dark";

const TRIP_TYPE_OPTIONS: { id: TripType; label: string; icon: typeof Plane }[] = [
  { id: "round-trip", label: "Return", icon: ArrowLeftRight },
  { id: "one-way", label: "One-Way", icon: Plane },
  { id: "multi-city", label: "Multi-City", icon: Route },
];

const CABIN_OPTIONS = [
  { id: "first-class", label: "First Class", sublabel: "", icon: Crown },
  { id: "first-preferred", label: "First Class Preferred", sublabel: "Business Class Considered", icon: Armchair },
  { id: "business-comparison", label: "Business Class", sublabel: "Comparison Requested", icon: Armchair },
] as const;

const CONTACT_METHOD_OPTIONS = [
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
] as const;

const PRIORITY_OPTIONS = [
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "sleep", label: "Sleep", icon: BedDouble },
  { id: "dining", label: "Dining", icon: UtensilsCrossed },
  { id: "lounge-access", label: "Lounge Access", icon: Armchair },
  { id: "flexible-fare", label: "Flexible Fare", icon: Ticket },
  { id: "refundability", label: "Refundability", icon: ShieldCheck },
  { id: "ground-service", label: "Ground Service", icon: Car },
  { id: "specific-aircraft", label: "Specific Aircraft", icon: Plane },
  { id: "special-occasion", label: "Special Occasion", icon: Gift },
  { id: "loyalty-programme", label: "Loyalty Programme", icon: Star },
];

const PROCESS_HIGHLIGHTS = [
  { id: "expert-guidance", label: "Expert Guidance", icon: Headset },
  { id: "best-airline-options", label: "Best Airline Options", icon: Plane },
  { id: "compare-routes-aircraft", label: "Compare Routes & Aircraft", icon: Route },
  { id: "personalised-recommendations", label: "Personalised Recommendations", icon: Sparkles },
];

const DIFFERENCE_TILES = [
  { id: "spacious-suites", label: "Spacious Suites", icon: Armchair },
  { id: "world-class-dining", label: "World-Class Dining", icon: UtensilsCrossed },
  { id: "exclusive-lounges", label: "Exclusive Lounges", icon: Crown },
  { id: "premium-airlines", label: "Premium Airlines", icon: Plane },
];

const COUNTRY_CODES = ["+1", "+44", "+91", "+61", "+971", "+33", "+49"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SectionHeading({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold text-[15px] font-bold text-white">
        {step}
      </span>
      <div>
        <h3 className="text-lg font-semibold text-text-dark">{title}</h3>
        <p className="mt-0.5 text-[13px] text-text-gray">{description}</p>
      </div>
    </div>
  );
}

function RadioCard({
  selected,
  onClick,
  icon: Icon,
  label,
  sublabel,
}: {
  selected: boolean;
  onClick: () => void;
  icon: typeof Plane;
  label: string;
  sublabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-2.5 rounded-input border px-3.5 py-3 text-left transition-colors ${
        selected ? "border-gold bg-gold/5" : "border-navy-deep/10 hover:border-navy-deep/25"
      }`}
    >
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-gold" : "border-navy-deep/25"
        }`}
      >
        {selected ? <span className="size-2 rounded-full bg-gold" /> : null}
      </span>
      <Icon size={16} className="shrink-0 text-navy-deep/70" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold text-text-dark">{label}</span>
        {sublabel ? <span className="block truncate text-[11px] text-text-gray">{sublabel}</span> : null}
      </span>
    </button>
  );
}

function CheckboxCard({ selected, onClick, icon: Icon, label }: { selected: boolean; onClick: () => void; icon: typeof Plane; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-2.5 rounded-input border px-3.5 py-3 text-left transition-colors ${
        selected ? "border-gold bg-gold/5" : "border-navy-deep/10 hover:border-navy-deep/25"
      }`}
    >
      <Icon size={16} className="shrink-0 text-navy-deep/70" aria-hidden="true" />
      <span className="flex-1 truncate text-[13px] font-semibold text-text-dark">{label}</span>
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border-2 ${
          selected ? "border-gold bg-gold" : "border-navy-deep/25"
        }`}
      >
        {selected ? <Check size={11} className="text-white" strokeWidth={3} /> : null}
      </span>
    </button>
  );
}

function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label className={FIELD_LABEL_CLASSES} htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export interface PersonalizedQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The elaborate "Request My Personalised Quote" form — deliberately its own
 * component rather than a variant of `FlightSearch.tsx`: that form's whole
 * design (two-step criteria/contact flow, compact card) is built for a
 * floating hero widget, while this one is a full travel-preference intake
 * form meant to fill a large modal. It still reuses `AirportAutocomplete`/
 * `DatePicker` for the fields those already solve well, and submits to the
 * same real `FormSubmission` backend `FlightSearch` does (not a no-op) —
 * just under its own `formType` so these richer leads are distinguishable
 * in the admin panel.
 */
export function PersonalizedQuoteModal({ open, onOpenChange }: PersonalizedQuoteModalProps) {
  const formId = useId();
  // Base UI's Dialog focuses the first focusable element by default, which
  // would be the Departure Airport field — immediately popping open its
  // "popular destinations" suggestion list the moment the modal opens, well
  // before the visitor has even read the form. Focusing the inert panel
  // itself instead keeps the dialog's real accessibility behavior (focus
  // moves into it, Escape/backdrop click still return focus to the trigger
  // on close) without that unwanted side effect.
  const initialFocusRef = useRef<HTMLDivElement>(null);

  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [datesFlexible, setDatesFlexible] = useState<"yes" | "no">("yes");

  const [cabin, setCabin] = useState<(typeof CABIN_OPTIONS)[number]["id"]>("first-class");
  const [travellers, setTravellers] = useState(1);
  const [overnightPreference, setOvernightPreference] = useState("No Preference");
  const [directPreference, setDirectPreference] = useState("No Preference");

  const [priorities, setPriorities] = useState<string[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState<(typeof CONTACT_METHOD_OPTIONS)[number]["id"]>("email");
  const [specialRequests, setSpecialRequests] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const todayIso = new Date().toISOString().slice(0, 10);

  function togglePriority(id: string) {
    setPriorities((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function resetForm() {
    setFrom(null);
    setTo(null);
    setTravelDate("");
    setReturnDate("");
    setTripType("round-trip");
    setDatesFlexible("yes");
    setCabin("first-class");
    setTravellers(1);
    setOvernightPreference("No Preference");
    setDirectPreference("No Preference");
    setPriorities([]);
    setFirstName("");
    setLastName("");
    setEmail("");
    setCountryCode(COUNTRY_CODES[0]);
    setPhone("");
    setContactMethod("email");
    setSpecialRequests("");
    setErrors({});
    setSubmitError("");
    setSubmitted(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      // Give the close animation a moment before wiping the form, so the
      // success message doesn't visibly flash back to a blank form while
      // the dialog is still fading out.
      setTimeout(resetForm, 200);
    }
    onOpenChange(next);
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!from) next.from = "Departure airport is required.";
    if (!to) next.to = "Destination is required.";
    if (!travelDate) next.travelDate = "Travel date is required.";
    if (tripType === "round-trip" && !returnDate) next.returnDate = "Return date is required.";
    if (!firstName.trim()) next.firstName = "First name is required.";
    if (!lastName.trim()) next.lastName = "Last name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = "Enter a valid email address.";
    if (!phone.trim()) next.phone = "Phone number is required.";
    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/v1/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "first_class_personalized_quote",
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email: email.trim(),
          phone: `${countryCode} ${phone.trim()}`,
          payload: {
            from,
            to,
            travelDate,
            returnDate: tripType === "round-trip" ? returnDate : null,
            tripType,
            datesFlexible,
            cabin,
            travellers,
            overnightPreference,
            directPreference,
            priorities,
            preferredContactMethod: contactMethod,
            specialRequests: specialRequests.trim() || null,
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        initialFocus={initialFocusRef}
        className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-hidden rounded-[20px] bg-white p-0 ring-1 ring-navy-deep/10 sm:max-w-5xl"
      >
        <div ref={initialFocusRef} tabIndex={-1} className="grid max-h-[90vh] grid-cols-1 outline-none lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left — editorial panel. Hidden on mobile so the form (the part
              that actually needs doing) isn't pushed below a tall intro. */}
          <div className="hidden overflow-y-auto bg-[#F7F3EC] lg:block">
            <div className="p-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold">First Class Travel</span>
              <h2 className="mt-3 font-heading text-3xl leading-[1.15] text-navy-deep">
                Let&rsquo;s Plan
                <br />
                Your <span className="text-gold">First Class</span>
                <br />
                Journey
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-text-gray">
                Tell us what you&rsquo;re looking for, and our premium travel specialists can help you compare
                suitable First Class flights, airlines, routes, aircraft, cabin experiences and fare options.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {PROCESS_HIGHLIGHTS.map((item) => (
                  <div key={item.id} className="flex flex-col items-center gap-2 text-center">
                    <span className="flex size-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <item.icon size={18} aria-hidden="true" />
                    </span>
                    <span className="text-[12px] font-medium leading-tight text-text-dark">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-7 aspect-[4/5] w-full overflow-hidden rounded-[16px]">
                <Image
                  src={unsplash("1474302770737-173ee21bab63")}
                  alt="A small private jet on the runway at sunset"
                  fill
                  sizes="(min-width: 1024px) 32vw, 0vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="bg-navy-deep p-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold">A More Refined Way to Travel</span>
              <h3 className="mt-3 font-heading text-2xl leading-tight text-white">Experience the Difference</h3>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {DIFFERENCE_TILES.map((tile) => (
                  <div key={tile.id} className="flex items-center gap-2.5 rounded-[10px] border border-white/15 bg-white/5 p-3">
                    <tile.icon size={16} className="shrink-0 text-gold" aria-hidden="true" />
                    <span className="text-[12px] font-medium text-white">{tile.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — the actual form. */}
          <div className="overflow-y-auto p-6 sm:p-8">
            {submitted ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-emerald/10 text-emerald">
                  <Check size={28} aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-2xl text-text-dark">Request received</h2>
                <p className="mt-2 max-w-sm text-[15px] text-text-gray">
                  Thank you — a First Class travel specialist will be in touch shortly with options tailored to your
                  journey.
                </p>
                <Button variant="navy" className="mt-7" onClick={() => handleOpenChange(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-9">
                <div className="space-y-5">
                  <SectionHeading step={1} title="Your Journey" description="Tell us your basic travel details." />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <AirportAutocomplete
                      label="Departure Airport"
                      value={from}
                      onChange={setFrom}
                      placeholder="Enter departure airport"
                      labelClassName="text-text-dark"
                      valueClassName="text-text-dark"
                    />
                    <AirportAutocomplete
                      label="Destination"
                      value={to}
                      onChange={setTo}
                      placeholder="Enter destination"
                      labelClassName="text-text-dark"
                      valueClassName="text-text-dark"
                    />
                  </div>
                  {errors.from || errors.to ? (
                    <p className="text-xs font-medium text-red-500">{errors.from ?? errors.to}</p>
                  ) : null}

                  <div className={`grid grid-cols-1 gap-4 ${tripType === "round-trip" ? "sm:grid-cols-2" : ""}`}>
                    <DatePicker
                      id={`${formId}-travel-date`}
                      label="Travel Date"
                      value={travelDate}
                      onChange={(iso) => {
                        setTravelDate(iso);
                        if (returnDate && iso > returnDate) setReturnDate("");
                      }}
                      min={todayIso}
                      placeholder="Select date"
                      align="start"
                      labelClassName="text-text-dark"
                      valueClassName="text-text-dark"
                    />
                    {tripType === "round-trip" ? (
                      <DatePicker
                        id={`${formId}-return-date`}
                        label="Return Date"
                        value={returnDate}
                        onChange={setReturnDate}
                        min={travelDate || todayIso}
                        placeholder="Select date"
                        align="end"
                        labelClassName="text-text-dark"
                        valueClassName="text-text-dark"
                      />
                    ) : null}
                  </div>
                  {errors.travelDate || errors.returnDate ? (
                    <p className="text-xs font-medium text-red-500">{errors.travelDate ?? errors.returnDate}</p>
                  ) : null}

                  <div>
                    <FieldLabel>Trip Type</FieldLabel>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      {TRIP_TYPE_OPTIONS.map((option) => (
                        <RadioCard
                          key={option.id}
                          selected={tripType === option.id}
                          onClick={() => setTripType(option.id)}
                          icon={option.icon}
                          label={option.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Are Your Dates Flexible?</FieldLabel>
                    <div className="grid grid-cols-2 gap-2.5">
                      <RadioCard selected={datesFlexible === "yes"} onClick={() => setDatesFlexible("yes")} icon={Calendar} label="Yes" />
                      <RadioCard selected={datesFlexible === "no"} onClick={() => setDatesFlexible("no")} icon={CalendarOff} label="No" />
                    </div>
                  </div>
                </div>

                <div className="space-y-5 border-t border-navy-deep/10 pt-8">
                  <SectionHeading
                    step={2}
                    title="Your Premium Travel Preferences"
                    description="Help us understand your preferred travel experience."
                  />

                  <div>
                    <FieldLabel>Preferred Cabin</FieldLabel>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      {CABIN_OPTIONS.map((option) => (
                        <RadioCard
                          key={option.id}
                          selected={cabin === option.id}
                          onClick={() => setCabin(option.id)}
                          icon={option.icon}
                          label={option.label}
                          sublabel={option.sublabel || undefined}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <FieldLabel htmlFor={`${formId}-travellers`}>Number of Travellers</FieldLabel>
                      <div className="relative">
                        <span className={FIELD_ICON_CLASSES}>
                          <User size={14} aria-hidden="true" />
                        </span>
                        <select
                          id={`${formId}-travellers`}
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

                    <div>
                      <FieldLabel htmlFor={`${formId}-overnight`}>Overnight Flight Preference</FieldLabel>
                      <div className="relative">
                        <span className={FIELD_ICON_CLASSES}>
                          <Phone size={14} aria-hidden="true" />
                        </span>
                        <select
                          id={`${formId}-overnight`}
                          value={overnightPreference}
                          onChange={(event) => setOvernightPreference(event.target.value)}
                          className={FIELD_CLASSES}
                        >
                          {["No Preference", "Prefer Overnight", "Prefer Daytime"].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <FieldLabel htmlFor={`${formId}-direct`}>Direct Flight Preference</FieldLabel>
                      <div className="relative">
                        <span className={FIELD_ICON_CLASSES}>
                          <Plane size={14} aria-hidden="true" />
                        </span>
                        <select
                          id={`${formId}-direct`}
                          value={directPreference}
                          onChange={(event) => setDirectPreference(event.target.value)}
                          className={FIELD_CLASSES}
                        >
                          {["No Preference", "Direct Only", "Connections OK"].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t border-navy-deep/10 pt-8">
                  <SectionHeading step={3} title="What Matters Most?" description="Select the aspects that are most important for your journey." />
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {PRIORITY_OPTIONS.map((option) => (
                      <CheckboxCard
                        key={option.id}
                        selected={priorities.includes(option.id)}
                        onClick={() => togglePriority(option.id)}
                        icon={option.icon}
                        label={option.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4 border-t border-navy-deep/10 pt-8">
                  <SectionHeading step={4} title="Your Contact Details" description="We'll use this information to share your personalised options." />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor={`${formId}-first-name`}>First Name</FieldLabel>
                      <div className="relative">
                        <span className={FIELD_ICON_CLASSES}>
                          <User size={14} aria-hidden="true" />
                        </span>
                        <input
                          id={`${formId}-first-name`}
                          type="text"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          placeholder="Enter first name"
                          className={FIELD_CLASSES}
                          aria-invalid={Boolean(errors.firstName)}
                        />
                      </div>
                      {errors.firstName ? <p className="mt-1 text-xs text-red-500">{errors.firstName}</p> : null}
                    </div>

                    <div>
                      <FieldLabel htmlFor={`${formId}-last-name`}>Last Name</FieldLabel>
                      <div className="relative">
                        <span className={FIELD_ICON_CLASSES}>
                          <User size={14} aria-hidden="true" />
                        </span>
                        <input
                          id={`${formId}-last-name`}
                          type="text"
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                          placeholder="Enter last name"
                          className={FIELD_CLASSES}
                          aria-invalid={Boolean(errors.lastName)}
                        />
                      </div>
                      {errors.lastName ? <p className="mt-1 text-xs text-red-500">{errors.lastName}</p> : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor={`${formId}-email`}>Email</FieldLabel>
                      <div className="relative">
                        <span className={FIELD_ICON_CLASSES}>
                          <Mail size={14} aria-hidden="true" />
                        </span>
                        <input
                          id={`${formId}-email`}
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="Enter your email"
                          className={FIELD_CLASSES}
                          aria-invalid={Boolean(errors.email)}
                        />
                      </div>
                      {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email}</p> : null}
                    </div>

                    <div>
                      <FieldLabel htmlFor={`${formId}-phone`}>Phone</FieldLabel>
                      <div className="flex gap-2">
                        <select
                          aria-label="Country code"
                          value={countryCode}
                          onChange={(event) => setCountryCode(event.target.value)}
                          className="w-20 shrink-0 rounded-input border border-navy-deep/10 bg-white px-2 text-sm font-medium text-text-dark outline-none transition-colors hover:border-navy-deep/20 focus:border-gold"
                        >
                          {COUNTRY_CODES.map((code) => (
                            <option key={code} value={code}>
                              {code}
                            </option>
                          ))}
                        </select>
                        <div className="relative flex-1">
                          <span className={FIELD_ICON_CLASSES}>
                            <Phone size={14} aria-hidden="true" />
                          </span>
                          <input
                            id={`${formId}-phone`}
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            placeholder="Enter phone number"
                            className={FIELD_CLASSES}
                            aria-invalid={Boolean(errors.phone)}
                          />
                        </div>
                      </div>
                      {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Preferred Contact Method</FieldLabel>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      {CONTACT_METHOD_OPTIONS.map((option) => (
                        <RadioCard
                          key={option.id}
                          selected={contactMethod === option.id}
                          onClick={() => setContactMethod(option.id)}
                          icon={option.icon}
                          label={option.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor={`${formId}-special-requests`}>Special Requests (Optional)</FieldLabel>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-3.5 flex size-7 items-center justify-center rounded-full bg-navy-deep/5 text-navy-deep">
                        <MapPin size={14} aria-hidden="true" />
                      </span>
                      <textarea
                        id={`${formId}-special-requests`}
                        value={specialRequests}
                        onChange={(event) => setSpecialRequests(event.target.value)}
                        placeholder="Tell us about any specific requirements, preferred airlines, occasions, etc."
                        rows={3}
                        className={`${FIELD_CLASSES} resize-none py-3`}
                      />
                    </div>
                  </div>
                </div>

                {submitError ? <p className="text-sm font-medium text-red-500">{submitError}</p> : null}

                <div>
                  <Button type="submit" variant="gold" className="w-full justify-center" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        Request My Personalised Quote
                        <ArrowRight size={16} aria-hidden="true" />
                      </>
                    )}
                  </Button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] text-text-gray">
                    <Lock size={12} aria-hidden="true" />
                    Your information is secure and will only be used to assist with your travel request.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
