"use client";

import { useEffect } from "react";

/**
 * shadcn/ui's portal-based components (Sheet, Dialog, DropdownMenu,
 * Tooltip, ...) render their content as a direct child of `document.body`
 * — not inside wherever they're written in JSX. A `.admin-theme` class on
 * a wrapper *inside* the page would never reach them, so those pieces
 * would silently fall back to the site-wide neutral theme instead of the
 * admin palette (confirmed: the mobile sidebar drawer rendered white/grey
 * instead of the admin's dark blue before this fix).
 *
 * Toggling the class on `<body>` itself puts it above every portal target,
 * since portaled content is appended as body's child. Runs on mount
 * (before any interaction can open a portal) and cleans up on unmount so
 * navigating away from /admin doesn't leak the admin theme onto the rest
 * of the site.
 */
export function AdminThemeScope() {
  useEffect(() => {
    document.body.classList.add("admin-theme");
    return () => {
      document.body.classList.remove("admin-theme");
    };
  }, []);

  return null;
}
