import type { SpotSize } from "./enums";

/** Mirrors `ParkingBooking.Domain.ValueObjects.Location`. */
export interface Location {
  latitude: number;
  longitude: number;
  address: string | null;
}

/** Mirrors `ParkingBooking.Domain.ValueObjects.SpotType`. */
export interface SpotType {
  size: SpotSize;
  hasElectricCharger: boolean;
  isCovered: boolean;
  isAccessible: boolean;
}
