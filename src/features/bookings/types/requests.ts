import type { Guid, IsoDateTime } from "@/types/common";

/**
 * Body of `POST /api/bookings` (`CreateBookingRequest`).
 * The user id is never sent: the API reads it from the token's `sub` claim.
 */
export interface CreateBookingRequest {
  parkingLotId: Guid;
  parkingSpotId: Guid;
  /** Must include a timezone offset, such as `Z` or `+02:00`. */
  startTime: IsoDateTime;
  /** Must include a timezone offset, and be after `startTime`. */
  endTime: IsoDateTime;
  notes?: string | null;
}
