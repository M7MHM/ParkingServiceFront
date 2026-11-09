import { currencyCodeSchema, moneyAmountSchema } from "@/lib/schemas/primitives";
import type { UpdateParkingLotInput } from "../api/parkings.service";
import { PARKING_LOT_DESCRIPTION_MAX_LENGTH, PARKING_LOT_NAME_MAX_LENGTH } from "./create-parking-lot";
import z from "zod";

export { SPOT_NUMBER_MAX_LENGTH, addSpotSchema, spotSizeSchema } from "./add-spot";
export type { AddSpotFormInput, AddSpotFormOutput } from "./add-spot";
export {
  PARKING_LOT_ADDRESS_MAX_LENGTH,
  PARKING_LOT_DESCRIPTION_MAX_LENGTH,
  PARKING_LOT_NAME_MAX_LENGTH,
  createParkingLotSchema,
  latitudeSchema,
  longitudeSchema,
} from "./create-parking-lot";
export type {
  CreateParkingLotFormInput,
  CreateParkingLotFormOutput,
} from "./create-parking-lot";
export { parkingLotIdParamsSchema } from "./params";
export type { ParkingLotIdParams } from "./params";
export {
  addSpotResponseSchema,
  availableSpotsResponseSchema,
  createParkingLotResponseSchema,
  locationSchema,
  parkingLotResponseSchema,
  parkingSpotResponseSchema,
  spotStatusSchema,
  spotTypeSchema,
} from "./responses";

export const updateParkingLotSchema = z.object({
  name: z
    .string({ error: "Name is required." })
    .trim()
    .min(1, "Name is required.")
    .max(PARKING_LOT_NAME_MAX_LENGTH, `Name cannot be longer than ${PARKING_LOT_NAME_MAX_LENGTH} characters.`),
  description: z
    .string({ error: "Description is required." })
    .trim()
    .min(1, "Description is required.")
    .max(
      PARKING_LOT_DESCRIPTION_MAX_LENGTH,
      `Description cannot be longer than ${PARKING_LOT_DESCRIPTION_MAX_LENGTH} characters.`,
    ),
  hourlyRateAmount: moneyAmountSchema,
  currency: currencyCodeSchema.optional(),
}) satisfies z.ZodType<UpdateParkingLotInput>;