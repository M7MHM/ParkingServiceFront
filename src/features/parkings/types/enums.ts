/** Mirrors `ParkingBooking.Domain.Enums.SpotSize`. */
export const SPOT_SIZES = [
  "Compact",
  "Standard",
  "Large",
  "Electric",
  "Accessible",
  "VIP",
] as const;

export type SpotSize = (typeof SPOT_SIZES)[number];

/** Mirrors `ParkingBooking.Domain.Enums.SpotStatus`. */
export const SPOT_STATUSES = [
  "Available",
  "Reserved",
  "Occupied",
  "Maintenance",
  "Disabled",
] as const;

export type SpotStatus = (typeof SPOT_STATUSES)[number];
