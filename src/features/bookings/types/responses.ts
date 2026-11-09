import type { Guid, IsoDateTime, Money } from "@/types/common";

import type { BookingStatus } from "./enums";

/** Response of `GET /api/bookings/{id}` (`BookingResponse`). */
export interface BookingResponse {
  id: Guid;
  parkingSpotId: Guid;
  userId: Guid;
  startTime: IsoDateTime;
  endTime: IsoDateTime;
  totalPrice: Money;
  status: BookingStatus;
  notes: string | null;
  createdAt: IsoDateTime;
}

/** Response of `POST /api/bookings` (HTTP 201). */
export interface CreateBookingResponse {
  id: Guid;
}
