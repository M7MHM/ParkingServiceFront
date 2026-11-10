import type { ParkingLotResponse } from "../types";

/**
 * Temporary data for `GET /api/parking-lots`, which the backend does not expose yet.
 * Shapes match `ParkingLotResponse`. Delete this file once the endpoint exists.
 */
export const MOCK_PARKING_LOTS: ParkingLotResponse[] = [
  {
    id: "3f2c1a9e-7b4d-4e0a-9c11-5a1d2b3c4d01",
    name: "Downtown Central Garage",
    description: "Multi-level garage a two-minute walk from the main square, with 24/7 security.",
    location: { latitude: 30.0444, longitude: 31.2357, address: "12 Tahrir Street, Cairo" },
    hourlyRate: { amount: 25, currency: "EGP" },
    totalSpots: 120,
    availableSpotsCount: 38,
    isActive: true,
    openingTime: "06:00:00",
    closingTime: "23:00:00",
    createdAt: "2026-01-12T09:30:00Z",
  },
  {
    id: "8b6d0e55-2a3c-4f71-8d92-6b2e3c4d5e02",
    name: "Airport Express Parking",
    description: "Covered long-stay parking with a free shuttle to all terminals every 10 minutes.",
    location: { latitude: 30.1219, longitude: 31.4056, address: "Airport Road, Heliopolis" },
    hourlyRate: { amount: 40, currency: "EGP" },
    totalSpots: 300,
    availableSpotsCount: 4,
    isActive: true,
    openingTime: "00:00:00",
    closingTime: "1.00:00:00",
    createdAt: "2026-02-03T11:00:00Z",
  },
  {
    id: "c41f7a30-9e8b-4b26-a5d3-7c3f4d5e6f03",
    name: "Riverside Mall Lot",
    description: "Open-air lot beside the river walk. Electric vehicle chargers on level one.",
    location: { latitude: 30.0626, longitude: 31.2197, address: null },
    hourlyRate: { amount: 15, currency: "EGP" },
    totalSpots: 80,
    availableSpotsCount: 0,
    isActive: true,
    openingTime: "09:00:00",
    closingTime: "22:00:00",
    createdAt: "2026-03-21T14:15:00Z",
  },
  {
    id: "d7a92b64-1c5e-4d38-b6e4-8d4a5e6f7a04",
    name: "Old Town Lot (closed for renovation)",
    description: "Small lot near the old market. Reopening soon.",
    location: { latitude: 30.0478, longitude: 31.2625, address: "Al-Muizz Street, Cairo" },
    hourlyRate: { amount: 10, currency: "EGP" },
    totalSpots: 30,
    availableSpotsCount: 0,
    isActive: false,
    openingTime: "08:00:00",
    closingTime: "18:00:00",
    createdAt: "2026-04-02T08:00:00Z",
  },
];
