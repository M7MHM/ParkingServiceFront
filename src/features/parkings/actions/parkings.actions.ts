"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import { guidSchema } from "@/lib/schemas/primitives";
import {
  createParkingLot,
  deleteParkingLot,
  updateParkingLot,
} from "../api/parkings.service";
import type { UpdateParkingLotInput } from "../api/parkings.service";
import {
  createParkingLotSchema,
  updateParkingLotSchema,
} from "../schemas";
import type { CreateParkingLotFormInput } from "../schemas";
import type { CreateParkingLotResponse } from "../types";
import { PARKING_ROUTES } from "../constants/routes";

export type ParkingActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

type ParkingActionFailure = Extract<ParkingActionResult, { success: false }>;

function describeApiError(error: ApiError): string {
  if (error.isRateLimited) return "Too many requests. Please wait a moment and try again.";
  if (error.isNetworkError) return error.title;
  if (error.isUnauthorized) return "Your session has expired. Please sign in again.";
  if (error.isForbidden) return "You do not have permission to manage parking lots.";
  if (error.status < 400) return "The server returned an unexpected response. Please try again.";
  return error.detail ?? error.title;
}

function failureFromApiError(error: ApiError): ParkingActionFailure {
  const hasFieldErrors = Object.keys(error.fieldErrors).length > 0;
  return {
    success: false,
    error: describeApiError(error),
    ...(hasFieldErrors && { fieldErrors: error.fieldErrors }),
  };
}

function failureFromValidation(error: z.ZodError): ParkingActionFailure {
  const fieldErrors: Record<string, string[]> = {};
  for (const [field, messages] of Object.entries(z.flattenError(error).fieldErrors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      fieldErrors[field] = messages;
    }
  }
  return { success: false, error: "Please correct the highlighted fields.", fieldErrors };
}

async function run<T>(request: () => Promise<T>): Promise<ParkingActionResult<T>> {
  try {
    return { success: true, data: await request() };
  } catch (error) {
    if (error instanceof ApiError) return failureFromApiError(error);
    throw error;
  }
}

export async function createParkingLotAction(
  input: CreateParkingLotFormInput,
): Promise<ParkingActionResult<CreateParkingLotResponse>> {
  const parsed = createParkingLotSchema.safeParse(input);
  if (!parsed.success) return failureFromValidation(parsed.error);

  const result = await run(() => createParkingLot(parsed.data));
  if (result.success) {
    revalidatePath(PARKING_ROUTES.LIST);
  }
  return result;
}

export async function updateParkingLotAction(
  id: string,
  input: UpdateParkingLotInput,
): Promise<ParkingActionResult<void>> {
  const lotId = guidSchema.safeParse(id);
  if (!lotId.success) return { success: false, error: "Invalid parking lot." };

  const parsed = updateParkingLotSchema.safeParse(input);
  if (!parsed.success) return failureFromValidation(parsed.error);

  const result = await run(() => updateParkingLot(lotId.data, parsed.data));
  if (result.success) {
    revalidatePath(PARKING_ROUTES.LIST);
    revalidatePath(PARKING_ROUTES.DETAIL(lotId.data));
  }
  return result;
}

export async function deleteParkingLotAction(id: string): Promise<ParkingActionResult<void>> {
  const lotId = guidSchema.safeParse(id);
  if (!lotId.success) return { success: false, error: "Invalid parking lot." };

  const result = await run(() => deleteParkingLot(lotId.data));
  if (result.success) {
    revalidatePath(PARKING_ROUTES.LIST);
    revalidatePath(PARKING_ROUTES.DETAIL(lotId.data));
  }
  return result;
}