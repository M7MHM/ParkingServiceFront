import { z } from "zod";

import { guidSchema } from "@/lib/schemas/primitives";

export const parkingLotIdParamsSchema = z.object({
  lotId: guidSchema,
});

export type ParkingLotIdParams = z.output<typeof parkingLotIdParamsSchema>;
