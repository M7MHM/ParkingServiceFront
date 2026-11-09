import { z } from "zod";

import { guidSchema } from "@/lib/schemas/primitives";

/** Route params for `/bookings/[bookingId]` and the cancel / complete commands. */
export const bookingIdParamsSchema = z.object({
  bookingId: guidSchema,
});

export type BookingIdParams = z.output<typeof bookingIdParamsSchema>;
