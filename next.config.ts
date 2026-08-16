import type { NextConfig } from "next";

/**
 * Applied to every response. Standard hardening for an API-only app:
 * no framing (clickjacking), no MIME-sniffing, no referrer leakage to
 * other origins, no browser feature access, and HSTS for when this is
 * actually served over HTTPS (the header is simply ignored over plain
 * HTTP, so it's safe to send unconditionally in dev too).
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: "default-src 'none'" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js sends `X-Powered-By: Next.js` by default — no reason to tell
  // an attacker what framework/version to target.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
