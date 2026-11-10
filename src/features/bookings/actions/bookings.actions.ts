"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { PARKING_ROUTES } from "@/features/parkings/constants/routes";
import { failureFromApiError, failureFromValidation } from "@/lib/actions/result";
import type { ActionResult } from "@/lib/actions/result";
import { ApiError } from "@/lib/api/client";
import { AUTH_ROUTES, REDIRECT_PARAM } from "@/lib/auth/constants";

import { cancelBooking, createBooking } from "../api/bookings.service";
import { bookingIdParamsSchema, createBookingSchema } from "../schemas";
import { BOOKING_ROUTES } from "../constants/routes";
import type { CreateBookingFormInput } from "../schemas";
import type { CreateBookingResponse } from "../types";

function describeApiError(error: ApiError): string {
  if (error.isRateLimited) return "Too many requests. Please wait a moment and try again.";
  if (error.isNetworkError) return error.title;
  if (error.isForbidden) return "You do not have permission to create this booking.";
  if (error.isNotFound) return error.detail ?? "That parking lot or spot no longer exists.";
  if (error.isConflict) return "Sorry, that spot was just taken. Please choose another one.";
  if (error.status < 400) return "The server returned an unexpected response. Please try again.";
  return error.detail ?? error.title;
}

export async function createBookingAction(
  input: CreateBookingFormInput,
): Promise<ActionResult<CreateBookingResponse>> {
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) return failureFromValidation(parsed.error);

  const detailPath = PARKING_ROUTES.DETAIL(parsed.data.parkingLotId);

  let result: ActionResult<CreateBookingResponse>;
  try {
    result = { success: true, data: await createBooking(parsed.data) };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    if (error.isUnauthorized) {
      redirect(`${AUTH_ROUTES.LOGIN}?${REDIRECT_PARAM}=${encodeURIComponent(detailPath)}`);
    }
    return failureFromApiError(error, describeApiError(error));
  }

  revalidatePath(detailPath);
  revalidatePath(BOOKING_ROUTES.LIST);
  return result;
}

export async function cancelBookingAction(bookingId: string): Promise<ActionResult> {
  const id = bookingIdParamsSchema.safeParse({ bookingId });
  if (!id.success) return { success: false, error: "Invalid booking." };

  try {
    await cancelBooking(id.data.bookingId);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    if (error.isUnauthorized) redirect(`${AUTH_ROUTES.LOGIN}?${REDIRECT_PARAM}=${encodeURIComponent(BOOKING_ROUTES.LIST)}`);
    return failureFromApiError(error, error.isNotFound ? "We couldn't find that booking." : undefined);
  }

  revalidatePath(BOOKING_ROUTES.LIST);
  revalidatePath("/parkings/[id]", "page");
  return { success: true };
}
