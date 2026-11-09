import { z } from "zod";

import {
  parseTimeOfDay,
  secondsToTimeSpan,
  timeSpanToSeconds,
} from "@/lib/utils/time-span";

/**
 * Accepts an `<input type="time">` value (`HH:mm`, `HH:mm:ss`) or a .NET `TimeSpan`
 * string (including `1.00:00:00`) and always outputs a canonical `TimeSpan` string.
 */
export const timeOfDaySchema = z
  .string({ error: "Time is required." })
  .trim()
  .transform((value, ctx) => {
    const seconds = parseTimeOfDay(value) ?? timeSpanToSeconds(value);
    if (seconds === null || seconds < 0) {
      ctx.addIssue({ code: "custom", message: "Enter a valid time." });
      return z.NEVER;
    }
    return secondsToTimeSpan(seconds);
  });
