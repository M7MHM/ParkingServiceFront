export const SECONDS_PER_DAY = 86_400;

const SECONDS_PER_HOUR = 3_600;
const SECONDS_PER_MINUTE = 60;

const TIME_SPAN_PATTERN = /^(-)?(?:(\d+)\.)?(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?$/;
const TIME_OF_DAY_PATTERN = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function timeSpanToSeconds(value: string): number | null {
  const match = TIME_SPAN_PATTERN.exec(value);
  if (!match) return null;

  const [, sign, days, hours, minutes, seconds, fraction] = match;
  const h = Number(hours);
  const m = Number(minutes);
  const s = Number(seconds);
  if (h > 23 || m > 59 || s > 59) return null;

  const total =
    (days ? Number(days) : 0) * SECONDS_PER_DAY +
    h * SECONDS_PER_HOUR +
    m * SECONDS_PER_MINUTE +
    s +
    (fraction ? Number(`0.${fraction}`) : 0);

  return sign ? -total : total;
}

export function parseTimeOfDay(value: string): number | null {
  const match = TIME_OF_DAY_PATTERN.exec(value);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = match[3] ? Number(match[3]) : 0;
  if (minutes > 59 || seconds > 59) return null;

  const total = hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
  return total <= SECONDS_PER_DAY ? total : null;
}

export function secondsToTimeSpan(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
  const remainder = totalSeconds % SECONDS_PER_DAY;

  const hours = Math.floor(remainder / SECONDS_PER_HOUR);
  const minutes = Math.floor((remainder % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = remainder % SECONDS_PER_MINUTE;

  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days}.${clock}` : clock;
}
