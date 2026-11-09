import { z } from "zod";

import { apiClient, apiRequest } from "@/lib/api/client";

import {
  createParkingLotResponseSchema,
  parkingLotResponseSchema,
} from "../schemas";
import type {
  CreateParkingLotRequest,
  CreateParkingLotResponse,
  ParkingLotResponse,
} from "../types";

const PARKING_LOTS_ENDPOINT = "/api/parking-lots";

export type CreateParkingLotInput = CreateParkingLotRequest;

export type UpdateParkingLotInput = Pick<
  CreateParkingLotRequest,
  "name" | "description" | "hourlyRateAmount" | "currency"
>;

const parkingLotListSchema = z.array(parkingLotResponseSchema);

function parkingLotPath(id: string): string {
  return `${PARKING_LOTS_ENDPOINT}/${encodeURIComponent(id)}`;
}

export function getParkingLots(): Promise<ParkingLotResponse[]> {
  return apiClient.get(PARKING_LOTS_ENDPOINT, parkingLotListSchema);
}

export function getParkingLotById(id: string): Promise<ParkingLotResponse> {
  return apiClient.get(parkingLotPath(id), parkingLotResponseSchema);
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
