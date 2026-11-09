import { z } from "zod";

import { guidSchema } from "@/lib/schemas/primitives";

/** Route params for `/parking-lots/[lotId]` and the admin lot routes. */
export const parkingLotIdParamsSchema = z.object({
  lotId: guidSchema,
});

export type ParkingLotIdParams = z.output<typeof parkingLotIdParamsSchema>;
