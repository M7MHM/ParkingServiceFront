import type { TimeSpan } from "@/types/common";

import type { SpotSize } from "./enums";
export interface CreateParkingLotRequest {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  hourlyRateAmount: number;
  currency?: string;
  totalSpots: number;
  openingTime: TimeSpan;
  closingTime: TimeSpan;
}
export interface AddSpotRequest {
  spotNumber: string;
  size: SpotSize;
  hourlyRateAmount: number;
  currency?: string;
  hasElectricCharger?: boolean;
  isCovered?: boolean;
  isAccessible?: boolean;
}
