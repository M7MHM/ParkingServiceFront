import { apiClient, apiRequest } from "@/lib/api/client";

import { MOCK_PARKING_LOTS } from "../mocks/parking-lots.mock";
import {
  availableSpotsResponseSchema,
  createParkingLotResponseSchema,
  parkingLotResponseSchema,
} from "../schemas";
import type {
  CreateParkingLotRequest,
  CreateParkingLotResponse,
  ParkingLotResponse,
  ParkingSpotResponse,
} from "../types";

const PARKING_LOTS_ENDPOINT = "/api/parking-lots";

export type CreateParkingLotInput = CreateParkingLotRequest;

export type UpdateParkingLotInput = Pick<
  CreateParkingLotRequest,
  "name" | "description" | "hourlyRateAmount" | "currency"
>;


function parkingLotPath(id: string): string {
  return `${PARKING_LOTS_ENDPOINT}/${encodeURIComponent(id)}`;
}

/**
 * TODO: `GET /api/parking-lots` is not implemented by the backend yet, so this returns mock data.
 * When it ships: `return apiClient.get(PARKING_LOTS_ENDPOINT, z.array(parkingLotResponseSchema), { auth: "none" })`
 * and delete `../mocks/parking-lots.mock.ts`.
 */
export async function getParkingLots(): Promise<ParkingLotResponse[]> {
  return MOCK_PARKING_LOTS;
}

export function getParkingLotById(id: string): Promise<ParkingLotResponse> {
  return apiClient.get(parkingLotPath(id), parkingLotResponseSchema, { auth: "none" });
}

export function getAvailableSpots(parkingLotId: string): Promise<ParkingSpotResponse[]> {
  return apiClient.get(`${parkingLotPath(parkingLotId)}/spots/available`, availableSpotsResponseSchema, {
    auth: "none",
  });
}

export function createParkingLot(data: CreateParkingLotInput): Promise<CreateParkingLotResponse> {
  return apiClient.post(PARKING_LOTS_ENDPOINT, createParkingLotResponseSchema, data);
}

export function updateParkingLot(id: string, data: UpdateParkingLotInput): Promise<void> {
  return apiRequest(parkingLotPath(id), { method: "PUT", body: data });
}

export function deleteParkingLot(id: string): Promise<void> {
  return apiRequest(parkingLotPath(id), { method: "DELETE" });
}
