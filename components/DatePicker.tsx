"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  formatDisplayDate,
  formatMonthLabel,
  getCalendarGrid,
  isSameDay,
  parseIsoDate,
  startOfDay,
  startOfMonth,
  toIsoDate,
  WEEKDAY_LABELS,
} from "@/lib/dateUtils";

interface DatePickerProps {
  id: string;
  label: string;
  /** ISO `yyyy-mm-dd`, or `""` if unset. */
  value: string;
  onChange: (iso: string) => void;
  /** ISO `yyyy-mm-dd` — days before this are disabled. Defaults to today. */
  min?: string;
  placeholder?: string;
  /** Which edge of the trigger the popup's own edge lines up with —
   * "start" (left) for a field on the left side of a row, "end" (right)
   * for one on the right, so the popup expands toward the side that
   * actually has room instead of centering and risking a viewport edge. */
  align?: "start" | "end";
}

interface Position {
  top: number;
  left: number;
  width: number;
}

const POPOVER_MARGIN = 8; // matches the previous `mt-2` gap below the trigger
const PAGE_EDGE_MARGIN = 8; // never let the popup touch the very edge of the page

/**
 * Custom calendar dropdown replacing the native `<input type="date">` — a
 * single reusable component for both Departure and Return, distinguished
 * only by `min` (Return passes Departure's value so it can never precede
 * it). Built without a date library since this is the only place in the
 * app that needs calendar math (see `lib/dateUtils.ts`).
 *
 * Rendered through a portal into `document.body`, positioned from the
 * trigger's measured `getBoundingClientRect()` — not a plain absolutely
 * positioned child of the trigger. The Hero section this field lives in
 * has `overflow-hidden` (it needs that to clip its own background image),
 * and a plain descendant popup gets silently clipped the moment it grows
 * past Hero's own box — which is exactly what "the calendar is hidden by
 * the section below it" was. A portal escapes that ancestor entirely, so
 * no ancestor's overflow can clip it regardless of how tall the page
 * layout around it is.
 */
export function DatePicker({ id, label, value, onChange, min, placeholder = "Select date", align = "start" }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // `document` always exists by the time the client hydrates, so checking
  // `typeof document !== "undefined"` directly in render takes the portal
  // branch on the very first client render — the one React uses to match
  // against the server's markup — while the server rendered `null` there
  // (no `document` during SSR). That mismatch is a real hydration error,
  // not a cosmetic one. `mounted` starts `false` on both server and the
  // client's first (hydration) render, so they render identically; it only
  // flips to `true` in an effect, which runs after hydration is already
  // committed, so the portal appearing then is just a normal client update.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const minDate = startOfDay(min ? parseIsoDate(min) : new Date());
  const selectedDate = value ? parseIsoDate(value) : null;
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selectedDate ?? minDate));

  // Keep the visible month in sync with external changes (e.g. Departure
  // moving Return's `min` forward) while the picker is closed.
  useEffect(() => {
    if (!open) setViewMonth(startOfMonth(selectedDate ?? minDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, min, open]);

  useEffect(() => {
    if (!open) return;

    function computePosition() {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(300, window.innerWidth - PAGE_EDGE_MARGIN * 2);
      const rawLeft = align === "end" ? rect.right + window.scrollX - width : rect.left + window.scrollX;
      const maxLeft = window.scrollX + window.innerWidth - width - PAGE_EDGE_MARGIN;
      const left = Math.min(Math.max(rawLeft, window.scrollX + PAGE_EDGE_MARGIN), Math.max(maxLeft, PAGE_EDGE_MARGIN));
      const top = rect.bottom + window.scrollY + POPOVER_MARGIN;
      setPosition({ top, left, width });
    }

    computePosition();

    // Scrolling or resizing while open would leave a stale position behind
    // (this is a one-shot measurement, not a continuously-tracked anchor)
    // — closing is simpler and safer than trying to keep it glued to the
    // trigger through every possible layout change.
    function handleDismiss() {
      setOpen(false);
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      const insideTrigger = triggerRef.current?.contains(target);
      const insidePopover = popoverRef.current?.contains(target);
      if (!insideTrigger && !insidePopover) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("scroll", handleDismiss, true);
    window.addEventListener("resize", handleDismiss);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleDismiss, true);
      window.removeEventListener("resize", handleDismiss);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, align]);

  const grid = getCalendarGrid(viewMonth);
  const isAtMinMonth = startOfMonth(viewMonth).getTime() <= startOfMonth(minDate).getTime();

  function selectDay(date: Date) {
    onChange(toIsoDate(date));
    setOpen(false);
  }

  return (
    <div className="relative flex-1">
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-text-gray">
        {label}
      </label>

      <button
        ref={triggerRef}
        type="button"
        id={id}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative flex w-full items-center rounded-input border border-navy-deep/10 bg-gray-light py-3 pl-10 pr-3 text-left text-sm font-medium outline-none transition-colors focus:border-emerald focus:bg-white"
      >
        <Calendar
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray"
          aria-hidden="true"
        />
        <span className={value ? "text-text-dark" : "text-text-gray"}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open && position ? (
                <motion.div
                  ref={popoverRef}
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  role="dialog"
                  aria-label={`${label} calendar`}
                  style={{ position: "absolute", top: position.top, left: position.left, width: position.width }}
                  className="z-50 rounded-card border border-navy-deep/10 bg-white p-4 shadow-soft"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setViewMonth((month) => addMonths(month, -1))}
                      disabled={isAtMinMonth}
                      aria-label="Previous month"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-text-gray transition-colors hover:bg-gray-light hover:text-navy-deep disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-semibold text-text-dark">{formatMonthLabel(viewMonth)}</span>
                    <button
                      type="button"
                      onClick={() => setViewMonth((month) => addMonths(month, 1))}
                      aria-label="Next month"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-text-gray transition-colors hover:bg-gray-light hover:text-navy-deep"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-text-gray">
                    {WEEKDAY_LABELS.map((weekday) => (
                      <span key={weekday}>{weekday}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {grid.map(({ date, inCurrentMonth }) => {
                      const disabled = date < minDate;
                      const selected = selectedDate ? isSameDay(date, selectedDate) : false;
                      const isToday = isSameDay(date, new Date());

                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          disabled={disabled}
                          onClick={() => selectDay(date)}
                          aria-current={isToday ? "date" : undefined}
                          aria-pressed={selected}
                          className={[
                            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                            !inCurrentMonth ? "text-text-gray/40" : "text-text-dark",
                            disabled
                              ? "cursor-not-allowed opacity-30"
                              : !selected
                                ? "hover:bg-emerald/10 hover:text-emerald"
                                : "",
                            selected ? "bg-emerald text-white" : "",
                            isToday && !selected ? "ring-1 ring-inset ring-emerald/50" : "",
                          ].join(" ")}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
