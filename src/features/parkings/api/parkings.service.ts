import { apiClient, apiRequest } from "@/lib/api/client";
import { isMockApi } from "@/lib/api/mock-mode";
import { requireAdmin } from "@/lib/auth/guards";
import { mockStore } from "@/mocks/store";

import {
  addSpotResponseSchema,
  availableSpotsResponseSchema,
  createParkingLotResponseSchema,
  parkingLotResponseSchema,
} from "../schemas";
import type {
  AddSpotRequest,
  AddSpotResponse,
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

export type SpotInput = AddSpotRequest;

function parkingLotPath(id: string): string {
  return `${PARKING_LOTS_ENDPOINT}/${encodeURIComponent(id)}`;
}

function spotPath(lotId: string, spotId: string): string {
  return `${parkingLotPath(lotId)}/spots/${encodeURIComponent(spotId)}`;
}

export async function getParkingLots(): Promise<ParkingLotResponse[]> {
  return mockStore.listLots();
}

export async function getParkingLotById(id: string): Promise<ParkingLotResponse> {
  if (isMockApi()) return mockStore.getLot(id);
  return apiClient.get(parkingLotPath(id), parkingLotResponseSchema, { auth: "none" });
}

export async function getAvailableSpots(parkingLotId: string): Promise<ParkingSpotResponse[]> {
  if (isMockApi()) return mockStore.listAvailableSpots(parkingLotId);
  return apiClient.get(`${parkingLotPath(parkingLotId)}/spots/available`, availableSpotsResponseSchema, {
    auth: "none",
  });
}

export async function getLotSpots(parkingLotId: string): Promise<ParkingSpotResponse[]> {
  if (isMockApi()) return mockStore.listSpots(parkingLotId);
  return getAvailableSpots(parkingLotId);
}

export async function createParkingLot(data: CreateParkingLotInput): Promise<CreateParkingLotResponse> {
  if (isMockApi()) {
    await requireAdmin();
    return mockStore.createLot(data);
  }
  return apiClient.post(PARKING_LOTS_ENDPOINT, createParkingLotResponseSchema, data);
}

export async function updateParkingLot(id: string, data: UpdateParkingLotInput): Promise<void> {
  if (isMockApi()) {
    await requireAdmin();
    return mockStore.updateLot(id, data);
  }
  return apiRequest(parkingLotPath(id), { method: "PUT", body: data });
}

export async function deleteParkingLot(id: string): Promise<void> {
  if (isMockApi()) {
    await requireAdmin();
    return mockStore.deleteLot(id);
  }
  return apiRequest(parkingLotPath(id), { method: "DELETE" });
}

export async function addSpot(parkingLotId: string, data: SpotInput): Promise<AddSpotResponse> {
  if (isMockApi()) {
    await requireAdmin();
    return mockStore.addSpot(parkingLotId, data);
  }
  return apiClient.post(`${parkingLotPath(parkingLotId)}/spots`, addSpotResponseSchema, data);
}

export async function updateSpot(parkingLotId: string, spotId: string, data: SpotInput): Promise<void> {
  if (isMockApi()) {
    await requireAdmin();
    return mockStore.updateSpot(parkingLotId, spotId, data);
  }
  return apiRequest(spotPath(parkingLotId, spotId), { method: "PUT", body: data });
}

export async function deleteSpot(parkingLotId: string, spotId: string): Promise<void> {
  if (isMockApi()) {
    await requireAdmin();
    return mockStore.deleteSpot(parkingLotId, spotId);
  }
  return apiRequest(spotPath(parkingLotId, spotId), { method: "DELETE" });
}

