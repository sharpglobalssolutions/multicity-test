/** Shared between `CookieConsentBanner` (writes the decision) and
 * `RawCodeInjector` (reads it to decide whether non-essential scripts may
 * run) — kept in one place so the storage key and event name can't drift
 * apart between the two. */

export const COOKIE_CONSENT_STORAGE_KEY = "mce-cookie-consent";
export const COOKIE_CONSENT_EVENT = "mce-cookie-consent-changed";

export type CookieConsentStatus = "accepted" | "rejected" | null;

export function getCookieConsentStatus(): CookieConsentStatus {
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    // Private browsing / blocked storage — treat as "no decision yet" so
    // non-essential scripts stay off rather than silently always-on.
    return null;
  }
}

export function setCookieConsentStatus(status: "accepted" | "rejected"): void {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, status);
  } catch {
    // Ignore — the in-memory event below still updates this tab's own
    // scripts for the current session even if persistence failed.
  }
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: status }),
  );
}
