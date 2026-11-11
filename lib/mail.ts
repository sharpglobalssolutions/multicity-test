import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { logger } from "@/lib/logger";
import { formTypeLabel } from "@/lib/form-submission-display";

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

function readSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !password || !from) {
    return null;
  }

  return { host, port: Number(port), user, password, from };
}

let cachedTransporter: Transporter | null = null;

function getTransporter(config: SmtpConfig): Transporter {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      // 465 is the implicit-TLS port; everything else (587, 25, ...) uses
      // STARTTLS, which nodemailer negotiates itself when `secure` is false.
      secure: config.port === 465,
      auth: { user: config.user, pass: config.password },
    });
  }
  return cachedTransporter;
}

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
  cc?: string;
}

/**
 * Sends an email over SMTP if `SMTP_HOST`/`PORT`/`USER`/`PASSWORD`/`FROM`
 * are all set; otherwise, in development, logs the message instead of
 * sending it, so flows that depend on this (e.g. password reset) keep
 * working before real credentials are configured.
 *
 * In production, an unconfigured SMTP throws instead of logging: `text`
 * can carry a password-reset link (an unhashed, account-takeover-capable
 * token — see `sendPasswordResetEmail`), and `logger.info` output ends up
 * in container logs / log aggregators that are far more widely readable
 * than an inbox. `forgotPassword` (`services/auth.service.ts`) already
 * catches and only logs this error, so the misconfiguration surfaces
 * loudly to the operator without changing the user-facing response.
 */
export async function sendMail(input: SendMailInput): Promise<void> {
  const config = readSmtpConfig();

  if (!config) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured — refusing to send email in production");
    }
    logger.info("SMTP not configured — logging email instead of sending", {
      to: input.to,
      subject: input.subject,
      text: input.text,
    });
    return;
  }

  const transporter = getTransporter(config);
  await transporter.sendMail({
    from: config.from,
    to: input.to,
    cc: input.cc,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

/**
 * Sends the "reset your password" email containing the raw token as a link.
 * `resetToken` is the raw (unhashed) token — the only place it exists once
 * this function returns is in the recipient's inbox and, briefly, the
 * caller's memory; only its hash is ever persisted.
 */
export async function sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

  await sendMail({
    to,
    subject: "Reset your MultiCityExperts password",
    text: `We received a request to reset your password.\n\nUse the link below within 1 hour to choose a new one:\n${resetLink}\n\nIf you didn't request this, you can safely ignore this email — your password won't change.`,
    html: `<p>We received a request to reset your password.</p><p>Use the link below within 1 hour to choose a new one:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you didn't request this, you can safely ignore this email — your password won't change.</p>`,
  });
}

export interface FormSubmissionNotificationInput {
  formType: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  payload: unknown;
}

/** Internal/technical keys that are never useful to a human reading this
 * notification — geolocation coordinates, airport-lookup metadata,
 * tracking data, raw ids — even nested inside an object value (e.g. an
 * airport-picker's `{ city, iata, lat, lon, matchField, ... }` result).
 * Matched case-insensitively against the payload's own key names. */
const IGNORED_PAYLOAD_KEYS = new Set([
  "lat",
  "lon",
  "lng",
  "latitude",
  "longitude",
  "coordinates",
  "coords",
  "geo",
  "icao",
  "matchfield",
  "countrycode",
  "ip",
  "ipaddress",
  "useragent",
  "sessionid",
  "id",
]);

/** Overrides `humanizeKey`'s default camelCase-splitting for abbreviations
 * it would otherwise mangle (e.g. "iata" -> "Iata" instead of the
 * conventional all-caps "IATA"). */
const LABEL_OVERRIDES: Record<string, string> = {
  iata: "Airport Code",
};

function humanizeKey(key: string): string {
  const override = LABEL_OVERRIDES[key.toLowerCase()];
  if (override) return override;
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function formatValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const items = value.map((item) => formatValue(item)).filter((item): item is string => item !== null);
    return items.length ? items.join(", ") : null;
  }
  if (typeof value === "object") {
    // A nested object (e.g. an airport-picker's full result attached to a
    // "from"/"to" field) — recurse through the same field-extraction/
    // filtering logic rather than dumping its raw JSON, so nested noise
    // (coordinates, lookup metadata) gets stripped exactly like top-level
    // fields do.
    const nested = extractPayloadFields(value);
    return nested.length ? nested.map((field) => `${field.label}: ${field.value}`).join(", ") : null;
  }
  const text = String(value).trim();
  return text.length ? text : null;
}

/** Turns a submission's freeform `payload` into an ordered list of
 * {label, value} pairs, dropping empty values and `IGNORED_PAYLOAD_KEYS`
 * (recursively, for nested object values too), so the notification only
 * ever shows a human useful summary rather than a raw JSON dump. */
function extractPayloadFields(payload: unknown): { label: string; value: string }[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];

  const fields: { label: string; value: string }[] = [];
  for (const [key, raw] of Object.entries(payload as Record<string, unknown>)) {
    if (IGNORED_PAYLOAD_KEYS.has(key.toLowerCase())) continue;
    const value = formatValue(raw);
    if (value === null) continue;
    fields.push({ label: humanizeKey(key), value });
  }
  return fields;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Notifies the team of a new public form submission (every form on the
 * site funnels through `services/form-submission.service.ts`'s
 * `submitForm`/`completeFormSubmission` — see those for the call sites).
 * Sent to `FORM_NOTIFICATION_EMAIL` (falling back to `SMTP_FROM`, so it
 * works with zero extra config) and CC'd to `FORM_NOTIFICATION_CC` if set.
 * Silently no-ops if neither SMTP nor a recipient is configured — this is
 * a nice-to-have notification, not a flow any user-facing behavior depends
 * on, so it must never be the reason a form submission fails.
 */
export async function sendFormSubmissionNotification(input: FormSubmissionNotificationInput): Promise<void> {
  const to = process.env.FORM_NOTIFICATION_EMAIL || process.env.SMTP_FROM;
  if (!to) return;

  const label = formTypeLabel(input.formType);
  const contactFields = [
    input.name ? { label: "Name", value: input.name } : null,
    input.email ? { label: "Email", value: input.email } : null,
    input.phone ? { label: "Phone", value: input.phone } : null,
  ].filter((field): field is { label: string; value: string } => field !== null);
  const detailFields = extractPayloadFields(input.payload);

  const textRows = (field: { label: string; value: string }) => `${field.label}: ${field.value}`;
  const text = [
    `New ${label} submission`,
    "",
    ...(contactFields.length ? contactFields.map(textRows) : ["No contact details provided yet."]),
    ...(detailFields.length ? ["", ...detailFields.map(textRows)] : []),
  ].join("\n");

  const rowHtml = (field: { label: string; value: string }) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e9edf1;color:#5b6b78;font-size:13px;width:38%;vertical-align:top;">${escapeHtml(field.label)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e9edf1;color:#0a1f2d;font-size:14px;vertical-align:top;">${escapeHtml(field.value)}</td>
    </tr>`;

  const html = `
    <div style="background-color:#f4f6f8;padding:24px 12px;font-family:Helvetica,Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e9edf1;">
        <div style="background-color:#041627;padding:20px 24px;">
          <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.7;">MultiCityExperts</p>
          <h1 style="margin:4px 0 0;color:#ffffff;font-size:18px;font-weight:600;">New ${escapeHtml(label)} submission</h1>
        </div>
        <div style="padding:24px;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            ${
              contactFields.length
                ? contactFields.map(rowHtml).join("")
                : `<tr><td style="padding:8px 0;color:#5b6b78;font-size:13px;">No contact details provided yet.</td></tr>`
            }
          </table>
          ${
            detailFields.length
              ? `<p style="margin:20px 0 8px;color:#5b6b78;font-size:12px;letter-spacing:0.05em;text-transform:uppercase;">Details</p>
                 <table role="presentation" width="100%" style="border-collapse:collapse;">${detailFields.map(rowHtml).join("")}</table>`
              : ""
          }
        </div>
      </div>
    </div>`;

  await sendMail({
    to,
    cc: process.env.FORM_NOTIFICATION_CC || undefined,
    subject: `New website submission — ${label}`,
    text,
    html,
  });
}
