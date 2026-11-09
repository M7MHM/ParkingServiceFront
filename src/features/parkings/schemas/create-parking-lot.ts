import { z } from "zod";

import {
  DEFAULT_CURRENCY,
  currencyCodeSchema,
  moneyAmountSchema,
} from "@/lib/schemas/primitives";
import { timeOfDaySchema } from "@/lib/schemas/time-of-day";
import { SECONDS_PER_DAY, timeSpanToSeconds } from "@/lib/utils/time-span";

import type { CreateParkingLotRequest } from "../types";

export const PARKING_LOT_NAME_MAX_LENGTH = 200;
export const PARKING_LOT_DESCRIPTION_MAX_LENGTH = 1000;
export const PARKING_LOT_ADDRESS_MAX_LENGTH = 500;

export const latitudeSchema = z
  .number({ error: "Latitude is required." })
  .min(-90, "Latitude must be between -90 and 90.")
  .max(90, "Latitude must be between -90 and 90.");

export const longitudeSchema = z
  .number({ error: "Longitude is required." })
  .min(-180, "Longitude must be between -180 and 180.")
  .max(180, "Longitude must be between -180 and 180.");

export const createParkingLotSchema = z
  .object({
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
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    address: z
      .string()
      .trim()
      .max(PARKING_LOT_ADDRESS_MAX_LENGTH, `Address cannot be longer than ${PARKING_LOT_ADDRESS_MAX_LENGTH} characters.`)
      .nullish(),
    hourlyRateAmount: moneyAmountSchema,
    currency: currencyCodeSchema.default(DEFAULT_CURRENCY),
    totalSpots: z
      .number({ error: "Total spots is required." })
      .int("Total spots must be a whole number.")
      .gt(0, "Total spots must be greater than zero."),
    openingTime: timeOfDaySchema,
    closingTime: timeOfDaySchema,
  })
  .superRefine((lot, ctx) => {
    const opening = timeSpanToSeconds(lot.openingTime);
    const closing = timeSpanToSeconds(lot.closingTime);
    if (opening === null || closing === null) return;

    if (opening >= SECONDS_PER_DAY) {
      ctx.addIssue({
        code: "custom",
        path: ["openingTime"],
        message: "Opening time must be earlier than 24:00.",
      });
    }
    if (closing <= opening) {
      ctx.addIssue({
        code: "custom",
        path: ["closingTime"],
        message: "Closing time must be later than opening time.",
      });
    } else if (closing > SECONDS_PER_DAY) {
      ctx.addIssue({
        code: "custom",
        path: ["closingTime"],
        message: "Closing time cannot be later than 24:00.",
      });
    }
  }) satisfies z.ZodType<CreateParkingLotRequest>;

export type CreateParkingLotFormInput = z.input<typeof createParkingLotSchema>;
export type CreateParkingLotFormOutput = z.output<typeof createParkingLotSchema>;
