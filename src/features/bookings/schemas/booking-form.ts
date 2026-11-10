import { z } from "zod";

import { formatTimeSpan } from "@/lib/utils/format";

import { isWithinOpeningHours, parseDatetimeLocal } from "../utils/booking-time";
import { BOOKING_NOTES_MAX_LENGTH } from "./create-booking";

/** Same one-minute clock-skew allowance the backend validator uses. */
const START_TOLERANCE_MS = 60_000;

export interface OpeningHours {
  openingTime: string;
  closingTime: string;
}

/**
 * Client-side form schema. Values are the raw `datetime-local` strings; they are converted to
 * ISO instants on submit and then validated again by `createBookingSchema` on the server.
 */
export function createBookingFormSchema(hours: OpeningHours) {
  return z
    .object({
      parkingSpotId: z.guid({ error: "Choose a parking spot." }),
      startTime: z.string().min(1, "Choose a start time."),
      endTime: z.string().min(1, "Choose an end time."),
      notes: z
        .string()
        .max(BOOKING_NOTES_MAX_LENGTH, `Notes cannot be longer than ${BOOKING_NOTES_MAX_LENGTH} characters.`),
    })
    .superRefine((form, ctx) => {
      const start = parseDatetimeLocal(form.startTime);
      const end = parseDatetimeLocal(form.endTime);

      if (form.startTime && Number.isNaN(start)) {
        ctx.addIssue({ code: "custom", path: ["startTime"], message: "Enter a valid start time." });
      }
      if (form.endTime && Number.isNaN(end)) {
        ctx.addIssue({ code: "custom", path: ["endTime"], message: "Enter a valid end time." });
      }
      if (Number.isNaN(start) || Number.isNaN(end)) return;

      if (start < Date.now() - START_TOLERANCE_MS) {
        ctx.addIssue({ code: "custom", path: ["startTime"], message: "Start time must be now or in the future." });
      } else if (!isWithinOpeningHours(start, hours.openingTime, hours.closingTime)) {
        ctx.addIssue({
          code: "custom",
          path: ["startTime"],
          message: `Bookings must start between ${formatTimeSpan(hours.openingTime)} and ${formatTimeSpan(hours.closingTime)} UTC.`,
        });
      }

      if (end <= start) {
        ctx.addIssue({ code: "custom", path: ["endTime"], message: "End time must be after the start time." });
      }
    });
}

export type BookingFormValues = z.input<ReturnType<typeof createBookingFormSchema>>;
