import { z } from "zod";

import {
  DEFAULT_CURRENCY,
  currencyCodeSchema,
  moneyAmountSchema,
} from "@/lib/schemas/primitives";

import { SPOT_SIZES } from "../types";
import type { AddSpotRequest } from "../types";

export const SPOT_NUMBER_MAX_LENGTH = 50;

export const spotSizeSchema = z.enum(SPOT_SIZES, { error: "Choose a spot size." });

/**
 * Mirrors `AddSpotRequest` and the `ParkingSpot` entity rules. The spot number is required,
 * at most 50 characters, and unique inside its lot (enforced by the backend, reported as 409).
 */
export const addSpotSchema = z.object({
  spotNumber: z
    .string({ error: "Spot number is required." })
    .trim()
    .min(1, "Spot number is required.")
    .max(SPOT_NUMBER_MAX_LENGTH, `Spot number cannot be longer than ${SPOT_NUMBER_MAX_LENGTH} characters.`),
  size: spotSizeSchema,
  hourlyRateAmount: moneyAmountSchema,
  currency: currencyCodeSchema.default(DEFAULT_CURRENCY),
  hasElectricCharger: z.boolean().default(false),
  isCovered: z.boolean().default(false),
  isAccessible: z.boolean().default(false),
}) satisfies z.ZodType<AddSpotRequest>;

export type AddSpotFormInput = z.input<typeof addSpotSchema>;
export type AddSpotFormOutput = z.output<typeof addSpotSchema>;
