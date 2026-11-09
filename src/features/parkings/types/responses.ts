import type { Guid, IsoDateTime, Money, TimeSpan } from "@/types/common";

import type { SpotStatus } from "./enums";
import type { Location, SpotType } from "./value-objects";

/** Response of `GET /api/parking-lots/{id}` (`ParkingLotResponse`). */
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

/** Item of `GET /api/parking-lots/{parkingLotId}/spots/available` (`ParkingSpotResponse`). */
export interface ParkingSpotResponse {
  id: Guid;
  spotNumber: string;
  type: SpotType;
  status: SpotStatus;
  hourlyRate: Money;
  currentBookingId: Guid | null;
  reservedUntil: IsoDateTime | null;
}

/** Response of `POST /api/parking-lots` (HTTP 201). */
export interface CreateParkingLotResponse {
  id: Guid;
}

/** Response of `POST /api/parking-lots/{parkingLotId}/spots` (HTTP 201). */
export interface AddSpotResponse {
  spotId: Guid;
  parkingLotId: Guid;
}
