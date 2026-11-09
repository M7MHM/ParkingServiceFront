/** Mirrors `ParkingBooking.Domain.Enums.BookingStatus`. */
export const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
  "Expired",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];
