import type { Guid, IsoDateTime, Money } from "@/types/common";

import type { BookingStatus } from "./enums";

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

export interface CreateBookingResponse {
  id: Guid;
}

export interface BookingSummary extends BookingResponse {
  parkingLotId: Guid;
  parkingLotName: string;
  spotNumber: string;
}
