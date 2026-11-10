import { apiClient, apiRequest } from "@/lib/api/client";
import { isMockApi } from "@/lib/api/mock-mode";
import { requireUser } from "@/lib/auth/guards";
import { mockStore } from "@/mocks/store";

import { createBookingResponseSchema } from "../schemas";
import type { BookingSummary, CreateBookingRequest, CreateBookingResponse } from "../types";

const BOOKINGS_ENDPOINT = "/api/bookings";

export async function createBooking(data: CreateBookingRequest): Promise<CreateBookingResponse> {
  if (isMockApi()) {
    const user = await requireUser();
    return mockStore.createBooking(user.id, data);
  }
  return apiClient.post(BOOKINGS_ENDPOINT, createBookingResponseSchema, data);
}

export async function cancelBooking(bookingId: string): Promise<void> {
  if (isMockApi()) {
    const user = await requireUser();
    return mockStore.cancelBooking(bookingId, user.id, user.role === "Admin");
  }
  return apiRequest(`${BOOKINGS_ENDPOINT}/${encodeURIComponent(bookingId)}/cancel`, { method: "POST" });
}

export async function getMyBookings(): Promise<BookingSummary[]> {
  const user = await requireUser();
  return mockStore.listBookings(user.id);
}

