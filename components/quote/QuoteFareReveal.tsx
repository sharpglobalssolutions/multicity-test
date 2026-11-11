"use client";

import { useEffect, useState } from "react";

// How long the loader plays before "Congratulations!" appears.
const LOADING_DURATION_MS = 2800;

/** The only interactive piece of `FlightSummaryCard` — isolated into its
 * own small client component so the rest of that card can stay a plain
 * server component. Shows a brief "searching fares" loader, then crossfades
 * into the congratulations message. */
export function QuoteFareReveal() {
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const doneLoading = setTimeout(() => setLoading(false), LOADING_DURATION_MS);
    return () => clearTimeout(doneLoading);
  }, []);

  useEffect(() => {
    if (loading) return;
    // Deferred one frame so the browser paints the opacity-0 state first —
    // otherwise React's first render of the revealed content would already
    // be opacity-100 and the transition would never visibly animate.
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, [loading]);

  if (loading) {
    return (
      <div className="mt-8 flex flex-col items-center gap-2 text-center" aria-live="polite">
        {/* Plain <img>, not next/image — image optimization would
            rasterize this to a single static frame, losing the
            animation. */}
        <img
          src="/images/quote-loader.gif"
          alt=""
          aria-hidden="true"
          className="h-auto w-full max-w-[280px] sm:max-w-xs"
        />
        <p className="text-[13px] font-medium text-navy-deep/70">
          Searching exclusive fares…
        </p>
      </div>
    );
  }

  return (
    <div
      className={`mt-8 text-center transition-opacity duration-500 ${revealed ? "opacity-100" : "opacity-0"}`}
      aria-live="polite"
    >
      <h2 className="text-xl text-[#00b67a] sm:text-2xl">Congratulations!</h2>
      <p className="mt-2 text-[13px] leading-[18px] font-semibold text-navy-deep/70">
        Exclusive unpublished fares are available for your flight.
      </p>
    </div>
  );
}
