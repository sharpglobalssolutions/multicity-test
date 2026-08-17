import type { NextConfig } from "next";

/** Next's dev-mode HMR relies on `eval()`-based source maps — only relax
 * `script-src` for that in development; production keeps it out. */
const isDev = process.env.NODE_ENV !== "production";

/** `'unsafe-inline'` on script/style is a pragmatic tradeoff: the App
 * Router streams inline hydration data and Next injects some inline
 * styles, and wiring per-request nonces through static `headers()` isn't
 * straightforward. Every other directive stays locked to `'self'` (plus
 * the one external image host the site actually uses). */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/**
 * Applied to every response. No framing (clickjacking), no MIME-sniffing,
 * no referrer leakage to other origins, no browser feature access, HSTS
 * for when this is served over HTTPS (the header is simply ignored over
 * plain HTTP, so it's safe to send unconditionally in dev too), and a CSP
 * scoped to what the site actually loads (see above).
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js sends `X-Powered-By: Next.js` by default — no reason to tell
  // an attacker what framework/version to target.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
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
