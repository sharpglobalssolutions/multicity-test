"use client";

import { useState, type FormEvent } from "react";

const COUNTRY_CODES = ["+1", "+44", "+91", "+971", "+33", "+49", "+39", "+34", "+90", "+61"] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const [countryCode, setCountryCode] = useState<string>(COUNTRY_CODES[0]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      const response = await fetch("/api/v1/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "newsletter_subscribe",
          email: email.trim(),
          phone: phone.trim() ? `${countryCode} ${phone.trim()}` : undefined,
          payload: { countryCode, phone: phone.trim() },
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      setPhone("");
      setEmail("");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return <p className="text-center text-sm font-medium text-navy-deep">You&apos;re subscribed — thank you!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <select
          value={countryCode}
          onChange={(event) => setCountryCode(event.target.value)}
          aria-label="Country code"
          className="rounded-full border border-navy-deep/15 bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors focus:border-navy-deep/40 sm:w-24"
        >
          {COUNTRY_CODES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone number"
          aria-label="Phone number"
          className="min-w-0 flex-1 rounded-full border border-navy-deep/15 bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-gray focus:border-navy-deep/40"
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          required
          className="min-w-0 flex-[1.5] rounded-full border border-navy-deep/15 bg-white px-4 py-3 text-sm text-text-dark outline-none transition-colors placeholder:text-text-gray focus:border-navy-deep/40"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="whitespace-nowrap rounded-full bg-navy-deep px-7 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-bright transition-colors hover:bg-navy-dark disabled:opacity-60"
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {status === "error" ? <p className="mt-3 text-center text-xs text-red-600">{error}</p> : null}
    </form>
  );
}
