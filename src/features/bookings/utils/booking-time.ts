import { SECONDS_PER_DAY, timeSpanToSeconds } from "@/lib/utils/time-span";

const MS_PER_HOUR = 3_600_000;
const QUARTER_HOUR_MS = 15 * 60_000;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toDatetimeLocalValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function nextQuarterHour(now: Date = new Date()): Date {
  return new Date(Math.ceil((now.getTime() + 1) / QUARTER_HOUR_MS) * QUARTER_HOUR_MS);
}

export function parseDatetimeLocal(value: string): number {
  return value ? new Date(value).getTime() : Number.NaN;
}

export function datetimeLocalToIso(value: string): string {
  return new Date(parseDatetimeLocal(value)).toISOString();
}

export function billedHours(startMs: number, endMs: number): number {
  return Math.ceil((endMs - startMs) / MS_PER_HOUR);
}

export function isWithinOpeningHours(startMs: number, openingTime: string, closingTime: string): boolean {
  const opening = timeSpanToSeconds(openingTime);
  const closing = timeSpanToSeconds(closingTime);
  if (opening === null || closing === null) return true;

  const start = new Date(startMs);
  const secondsIntoDay = start.getUTCHours() * 3_600 + start.getUTCMinutes() * 60 + start.getUTCSeconds();
  return secondsIntoDay >= opening && secondsIntoDay <= Math.min(closing, SECONDS_PER_DAY);
}
