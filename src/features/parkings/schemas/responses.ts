import { z } from "zod";

import {
  guidSchema,
  isoDateTimeSchema,
  moneySchema,
  timeSpanSchema,
} from "@/lib/schemas/primitives";

import { SPOT_SIZES, SPOT_STATUSES } from "../types";
import type {
  AddSpotResponse,
  CreateParkingLotResponse,
  Location,
  ParkingLotResponse,
  ParkingSpotResponse,
  SpotType,
} from "../types";

export const spotStatusSchema = z.enum(SPOT_STATUSES);

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().nullable(),
}) satisfies z.ZodType<Location>;

export const spotTypeSchema = z.object({
  size: z.enum(SPOT_SIZES),
  hasElectricCharger: z.boolean(),
  isCovered: z.boolean(),
  isAccessible: z.boolean(),
}) satisfies z.ZodType<SpotType>;

export const parkingLotResponseSchema = z.object({
  id: guidSchema,
  name: z.string(),
  description: z.string(),
  location: locationSchema,
  hourlyRate: moneySchema,
  totalSpots: z.number().int().nonnegative(),
  availableSpotsCount: z.number().int().nonnegative(),
  isActive: z.boolean(),
  openingTime: timeSpanSchema,
  closingTime: timeSpanSchema,
  createdAt: isoDateTimeSchema,
}) satisfies z.ZodType<ParkingLotResponse>;

export const parkingSpotResponseSchema = z.object({
  id: guidSchema,
  spotNumber: z.string(),
  type: spotTypeSchema,
  status: spotStatusSchema,
  hourlyRate: moneySchema,
  currentBookingId: guidSchema.nullable(),
  reservedUntil: isoDateTimeSchema.nullable(),
}) satisfies z.ZodType<ParkingSpotResponse>;

export const availableSpotsResponseSchema = z.array(parkingSpotResponseSchema);

export const createParkingLotResponseSchema = z.object({
  id: guidSchema,
}) satisfies z.ZodType<CreateParkingLotResponse>;

export const addSpotResponseSchema = z.object({
  spotId: guidSchema,
  parkingLotId: guidSchema,
}) satisfies z.ZodType<AddSpotResponse>;
