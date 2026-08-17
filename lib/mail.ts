import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { logger } from "@/lib/logger";

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
}

/**
 * Sends an email over SMTP if `SMTP_HOST`/`PORT`/`USER`/`PASSWORD`/`FROM`
 * are all set; otherwise logs the message instead of sending it, so flows
 * that depend on this (e.g. password reset) keep working before real
 * credentials are configured.
 */
export async function sendMail(input: SendMailInput): Promise<void> {
  const config = readSmtpConfig();

  if (!config) {
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
