import { z } from "zod";

import { guidSchema } from "@/lib/schemas/primitives";

export const bookingIdParamsSchema = z.object({
  bookingId: guidSchema,
});

export type BookingIdParams = z.output<typeof bookingIdParamsSchema>;
