import { z } from "zod";

import { guidSchema, isoDateTimeWithOffsetSchema } from "@/lib/schemas/primitives";

import type { CreateBookingRequest } from "../types";

export const BOOKING_NOTES_MAX_LENGTH = 2000;

/** The backend accepts a start up to one minute in the past (clock skew). */
const START_TIME_TOLERANCE_MS = 60_000;

/**
 * Mirrors `CreateBookingRequest` + `CreateBookingCommandValidator`.
 * `userId` is intentionally absent: the API takes it from the token.
 */
export const createBookingSchema = z
  .object({
    parkingLotId: guidSchema,
    parkingSpotId: guidSchema,
    startTime: isoDateTimeWithOffsetSchema,
    endTime: isoDateTimeWithOffsetSchema,
    notes: z
      .string()
      .max(BOOKING_NOTES_MAX_LENGTH, `Notes cannot be longer than ${BOOKING_NOTES_MAX_LENGTH} characters.`)
      .nullish(),
  })
  .refine((booking) => Date.parse(booking.startTime) >= Date.now() - START_TIME_TOLERANCE_MS, {
    path: ["startTime"],
    error: "Booking start must include a timezone and be now or in the future.",
  })
  .refine((booking) => Date.parse(booking.endTime) > Date.parse(booking.startTime), {
    path: ["endTime"],
    error: "Booking end must include a timezone and be after its start.",
  }) satisfies z.ZodType<CreateBookingRequest>;

export type CreateBookingFormInput = z.input<typeof createBookingSchema>;
export type CreateBookingFormOutput = z.output<typeof createBookingSchema>;
