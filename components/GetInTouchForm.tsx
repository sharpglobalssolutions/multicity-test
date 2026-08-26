"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

export function GetInTouchForm() {
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
          formType: "get_in_touch",
          email: email.trim(),
          payload: {},
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return <p className="text-sm font-medium text-white">Thanks — we&apos;ll be in touch shortly.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-stretch overflow-hidden rounded-full border border-white/20 bg-white/5">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Get in touch — your email"
          aria-label="Email address"
          required
          className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-white outline-none placeholder:text-white/50"
        />
        <button
          type="submit"
          aria-label="Submit"
          disabled={status === "submitting"}
          className="flex shrink-0 items-center justify-center px-4 text-white transition-colors hover:text-emerald-bright disabled:opacity-60"
        >
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
      {status === "error" ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </form>
  );
}
