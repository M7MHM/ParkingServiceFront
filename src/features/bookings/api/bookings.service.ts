import { apiClient } from "@/lib/api/client";

import { createBookingResponseSchema } from "../schemas";
import type { CreateBookingRequest, CreateBookingResponse } from "../types";

const BOOKINGS_ENDPOINT = "/api/bookings";

export function createBooking(data: CreateBookingRequest): Promise<CreateBookingResponse> {
  return apiClient.post(BOOKINGS_ENDPOINT, createBookingResponseSchema, data);
}
