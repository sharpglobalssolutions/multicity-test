import "server-only";

/**
 * In-memory fixed-window rate limiter. Deliberately simple — no Redis or
 * other shared store exists in this project yet. That means limits are
 * per-process: correct for a single long-running server, but each
 * instance in a multi-instance/serverless deployment counts
 * independently, so the *effective* limit scales with instance count.
 * Good enough as a first layer of defense; swap the `buckets` Map for a
 * shared store (e.g. Redis) if/when this runs on more than one instance.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Bounds memory use — sweeps expired buckets so keys that are hit once
 * (e.g. a one-off IP) don't accumulate forever. Runs at most once per
 * process; harmless if it never fires in a short-lived serverless
 * instance. */
let cleanupTimer: ReturnType<typeof setInterval> | undefined;
function ensureCleanupScheduled(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(
    () => {
      const now = Date.now();
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
      }
    },
    10 * 60 * 1000,
  );
  cleanupTimer.unref?.();
}

export interface RateLimitResult {
  allowed: boolean;
  /** Only meaningful when `allowed` is false. */
  retryAfterSeconds: number;
}

/**
 * Checks and records one attempt against `key` within a fixed window.
 * `key` should already include whatever the limit is scoped to (e.g.
 * `login:${ip}`) — this function has no opinion on what a "key" means.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  ensureCleanupScheduled();

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Best-effort client IP extraction from proxy headers. Only trustworthy
 * behind a proxy that sets these itself and strips any client-supplied
 * value (true on Vercel and most managed platforms) — on an untrusted
 * network path, a client could forge these headers to evade rate
 * limiting. Falls back to a constant key so local/direct requests still
 * share a single (global) bucket rather than bypassing the limit
 * entirely.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
