/** Calendar-day math for the custom `DatePicker` — deliberately dependency-free
 * (no date-fns/dayjs) since this is the only place in the app that needs it.
 * All dates are treated as local calendar days, not instants — every ISO
 * string is parsed at local midnight so day-of-month math never drifts a day
 * because of timezone offset. */

/** Parses a `yyyy-mm-dd` string as local midnight. `new Date("yyyy-mm-dd")`
 * (no time component) parses as UTC midnight instead, which can land on the
 * previous day in any timezone west of UTC — appending a local time avoids
 * that. */
export function parseIsoDate(iso: string): Date {
  const [year = 1970, month = 1, day = 1] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
}

/** Full 6x7 grid for the month containing `monthDate`, including the
 * leading/trailing days from the adjacent months needed to fill the grid. */
export function getCalendarGrid(monthDate: Date): CalendarDay[] {
  const firstOfMonth = startOfMonth(monthDate);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return { date, inCurrentMonth: date.getMonth() === firstOfMonth.getMonth() };
  });
}

export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** e.g. "Wed, Mar 12, 2026" — used for the picker's own display text, since
 * the underlying value stays a plain ISO string. */
export function formatDisplayDate(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
