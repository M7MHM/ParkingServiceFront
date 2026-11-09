import type { TimeSpan } from "@/types/common";

import type { SpotSize } from "./enums";

/** Body of `POST /api/parking-lots` (`CreateParkingLotRequest`). Admin only. */
export interface CreateParkingLotRequest {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  hourlyRateAmount: number;
  /** Defaults to `EGP` on the server. */
  currency?: string;
  totalSpots: number;
  /** `TimeSpan` in `[0, 24h)`. */
  openingTime: TimeSpan;
  /** `TimeSpan` after `openingTime`, at most `24h` (`1.00:00:00`). */
  closingTime: TimeSpan;
}

/** Body of `POST /api/parking-lots/{parkingLotId}/spots` (`AddSpotRequest`). Admin only. */
export interface AddSpotRequest {
  spotNumber: string;
  size: SpotSize;
  hourlyRateAmount: number;
  /** Defaults to `EGP` on the server. */
  currency?: string;
  hasElectricCharger?: boolean;
  isCovered?: boolean;
  isAccessible?: boolean;
}
