import type { ParkingLotResponse } from "../types";

export type ParkingLotAvailability = "closed" | "full" | "limited" | "available";

export function getAvailability(lot: ParkingLotResponse): ParkingLotAvailability {
  if (!lot.isActive) return "closed";
  if (lot.availableSpotsCount === 0) return "full";
  return lot.availableSpotsCount / Math.max(lot.totalSpots, 1) <= 0.1 ? "limited" : "available";
}

export const AVAILABILITY_STYLES: Record<ParkingLotAvailability, { label: string; className: string }> = {
  available: { label: "Spots available", className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  limited: { label: "Filling up", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  full: { label: "Full", className: "bg-red-50 text-red-800 ring-red-200" },
  closed: { label: "Closed", className: "bg-slate-100 text-slate-700 ring-slate-300" },
};
