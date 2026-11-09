import type { Guid, IsoDateTime, Money, TimeSpan } from "@/types/common";

import type { SpotStatus } from "./enums";
import type { Location, SpotType } from "./value-objects";

export interface ParkingLotResponse {
  id: Guid;
  name: string;
  description: string;
  location: Location;
  hourlyRate: Money;
  totalSpots: number;
  availableSpotsCount: number;
  isActive: boolean;
  openingTime: TimeSpan;
  closingTime: TimeSpan;
  createdAt: IsoDateTime;
}
export interface ParkingSpotResponse {
  id: Guid;
  spotNumber: string;
  type: SpotType;
  status: SpotStatus;
  hourlyRate: Money;
  currentBookingId: Guid | null;
  reservedUntil: IsoDateTime | null;
}
export interface CreateParkingLotResponse {
  id: Guid;
}
export interface AddSpotResponse {
  spotId: Guid;
  parkingLotId: Guid;
}
