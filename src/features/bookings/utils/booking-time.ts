import { SECONDS_PER_DAY, timeSpanToSeconds } from "@/lib/utils/time-span";

const MS_PER_HOUR = 3_600_000;
const QUARTER_HOUR_MS = 15 * 60_000;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Formats a date for `<input type="datetime-local">` (local wall-clock time, minute precision). */
export function toDatetimeLocalValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** The next quarter hour after `now`, used as a friendly default start. */
export function nextQuarterHour(now: Date = new Date()): Date {
  return new Date(Math.ceil((now.getTime() + 1) / QUARTER_HOUR_MS) * QUARTER_HOUR_MS);
}

/** Parses a `datetime-local` value (interpreted in the browser's timezone) to epoch ms, or `NaN`. */
export function parseDatetimeLocal(value: string): number {
  return value ? new Date(value).getTime() : Number.NaN;
}

/** `datetime-local` value -> ISO string ending in `Z`, which the API requires (it rejects unzoned times). */
export function datetimeLocalToIso(value: string): string {
  return new Date(parseDatetimeLocal(value)).toISOString();
}

/** Mirrors the backend: billed hours are the duration rounded up to whole hours. */
export function billedHours(startMs: number, endMs: number): number {
  return Math.ceil((endMs - startMs) / MS_PER_HOUR);
}

/**
 * Mirrors `ParkingLot.IsOpenAt`: the backend compares the booking start's UTC time of day
 * with the lot's opening and closing times (inclusive).
 */
export function isWithinOpeningHours(startMs: number, openingTime: string, closingTime: string): boolean {
  const opening = timeSpanToSeconds(openingTime);
  const closing = timeSpanToSeconds(closingTime);
  if (opening === null || closing === null) return true;

  const start = new Date(startMs);
  const secondsIntoDay = start.getUTCHours() * 3_600 + start.getUTCMinutes() * 60 + start.getUTCSeconds();
  return secondsIntoDay >= opening && secondsIntoDay <= Math.min(closing, SECONDS_PER_DAY);
}
