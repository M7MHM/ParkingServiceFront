import type { SpotSize } from "./enums";
export interface Location {
  latitude: number;
  longitude: number;
  address: string | null;
}
export interface SpotType {
  size: SpotSize;
  hasElectricCharger: boolean;
  isCovered: boolean;
  isAccessible: boolean;
}
