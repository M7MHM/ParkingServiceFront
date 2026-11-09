import { z } from "zod";

import { guidSchema, isoDateTimeSchema, moneySchema } from "@/lib/schemas/primitives";

import { BOOKING_STATUSES } from "../types";
import type { BookingResponse, CreateBookingResponse } from "../types";

export const bookingStatusSchema = z.enum(BOOKING_STATUSES);

export const bookingResponseSchema = z.object({
  id: guidSchema,
  parkingSpotId: guidSchema,
  userId: guidSchema,
  startTime: isoDateTimeSchema,
  endTime: isoDateTimeSchema,
  totalPrice: moneySchema,
  status: bookingStatusSchema,
  notes: z.string().nullable(),
  createdAt: isoDateTimeSchema,
}) satisfies z.ZodType<BookingResponse>;

export const createBookingResponseSchema = z.object({
  id: guidSchema,
}) satisfies z.ZodType<CreateBookingResponse>;
