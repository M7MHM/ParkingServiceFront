import { randomUUID } from "node:crypto";

import { isWithinOpeningHours, billedHours } from "@/features/bookings/utils/booking-time";
import type { BookingStatus, BookingSummary, CreateBookingRequest } from "@/features/bookings/types";
import type {
  AddSpotRequest,
  CreateParkingLotRequest,
  ParkingLotResponse,
  ParkingSpotResponse,
  SpotSize,
} from "@/features/parkings/types";
import { ApiError } from "@/lib/api/client";

import { DEMO_CUSTOMER_ID } from "./constants";

type LotRecord = {
  lot: Omit<ParkingLotResponse, "totalSpots" | "availableSpotsCount">;
  spots: ParkingSpotResponse[];
};

type MockState = {
  lots: Map<string, LotRecord>;
  bookings: Map<string, BookingSummary>;
};

const MAX_GENERATED_SPOTS = 60;
const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

const notFound = (what: string) =>
  new ApiError({ status: 404, title: "Resource not found.", detail: `${what} was not found.` });

const spotUnavailable = () =>
  new ApiError({
    status: 409,
    title: "Parking spot unavailable.",
    detail: "The requested spot is not currently available.",
  });

const SIZE_CYCLE: SpotSize[] = ["Standard", "Standard", "Compact", "Large", "Electric", "Accessible", "VIP"];
const SIZE_RATE_FACTOR: Record<SpotSize, number> = {
  Compact: 0.8,
  Standard: 1,
  Large: 1.25,
  Electric: 1.2,
  Accessible: 1,
  VIP: 2,
};

function buildSpot(prefix: string, index: number, baseRate: number, currency: string): ParkingSpotResponse {
  const size = SIZE_CYCLE[index % SIZE_CYCLE.length];
  return {
    id: randomUUID(),
    spotNumber: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    type: {
      size,
      hasElectricCharger: size === "Electric",
      isCovered: size === "VIP" || index % 3 === 0,
      isAccessible: size === "Accessible",
    },
    status: "Available",
    hourlyRate: { amount: Math.round(baseRate * SIZE_RATE_FACTOR[size] * 100) / 100, currency },
    currentBookingId: null,
    reservedUntil: null,
  };
}

function seedLot(
  id: string,
  prefix: string,
  spotCount: number,
  lot: Omit<ParkingLotResponse, "id" | "totalSpots" | "availableSpotsCount">,
  busy: (index: number) => ParkingSpotResponse["status"] = (index) =>
    index % 7 === 6 ? "Maintenance" : index % 5 === 4 ? "Occupied" : "Available",
): LotRecord {
  const spots = Array.from({ length: spotCount }, (_, index) => {
    const spot = buildSpot(prefix, index, lot.hourlyRate.amount, lot.hourlyRate.currency);
    return { ...spot, status: busy(index) };
  });
  return { lot: { id, ...lot }, spots };
}

function seed(): MockState {
  const lots = new Map<string, LotRecord>();
  const add = (record: LotRecord) => lots.set(record.lot.id, record);

  add(
    seedLot("3f2c1a9e-7b4d-4e0a-9c11-5a1d2b3c4d01", "D", 14, {
      name: "Downtown Central Garage",
      description: "Multi-level garage a two-minute walk from the main square, with 24/7 security.",
      location: { latitude: 30.0444, longitude: 31.2357, address: "12 Tahrir Street, Cairo" },
      hourlyRate: { amount: 25, currency: "EGP" },
      isActive: true,
      openingTime: "06:00:00",
      closingTime: "23:00:00",
      createdAt: "2026-01-12T09:30:00Z",
    }),
  );
  add(
    seedLot("8b6d0e55-2a3c-4f71-8d92-6b2e3c4d5e02", "A", 10, {
      name: "Airport Express Parking",
      description: "Covered long-stay parking with a free shuttle to all terminals every 10 minutes.",
      location: { latitude: 30.1219, longitude: 31.4056, address: "Airport Road, Heliopolis" },
      hourlyRate: { amount: 40, currency: "EGP" },
      isActive: true,
      openingTime: "00:00:00",
      closingTime: "1.00:00:00",
      createdAt: "2026-02-03T11:00:00Z",
    }, (index) => (index < 8 ? "Occupied" : "Available")),
  );
  add(
    seedLot("c41f7a30-9e8b-4b26-a5d3-7c3f4d5e6f03", "R", 8, {
      name: "Riverside Mall Lot",
      description: "Open-air lot beside the river walk. Electric vehicle chargers on level one.",
      location: { latitude: 30.0626, longitude: 31.2197, address: null },
      hourlyRate: { amount: 15, currency: "EGP" },
      isActive: true,
      openingTime: "09:00:00",
      closingTime: "22:00:00",
      createdAt: "2026-03-21T14:15:00Z",
    }, () => "Occupied"),
  );
  add(
    seedLot("d7a92b64-1c5e-4d38-b6e4-8d4a5e6f7a04", "O", 6, {
      name: "Old Town Lot",
      description: "Small lot near the old market. Closed for renovation, reopening soon.",
      location: { latitude: 30.0478, longitude: 31.2625, address: "Al-Muizz Street, Cairo" },
      hourlyRate: { amount: 10, currency: "EGP" },
      isActive: false,
      openingTime: "08:00:00",
      closingTime: "18:00:00",
      createdAt: "2026-04-02T08:00:00Z",
    }, () => "Maintenance"),
  );

  const bookings = new Map<string, BookingSummary>();
  const now = Date.now();
  const downtown = lots.get("3f2c1a9e-7b4d-4e0a-9c11-5a1d2b3c4d01")!;
  const airport = lots.get("8b6d0e55-2a3c-4f71-8d92-6b2e3c4d5e02")!;

  const addBooking = (
    record: LotRecord,
    spotIndex: number,
    startOffsetMs: number,
    hours: number,
    status: BookingStatus,
    notes: string | null,
  ) => {
    const spot = record.spots[spotIndex];
    const id = randomUUID();
    const start = now + startOffsetMs;
    const end = start + hours * HOUR_MS;
    bookings.set(id, {
      id,
      userId: DEMO_CUSTOMER_ID,
      parkingLotId: record.lot.id,
      parkingLotName: record.lot.name,
      parkingSpotId: spot.id,
      spotNumber: spot.spotNumber,
      startTime: new Date(start).toISOString(),
      endTime: new Date(end).toISOString(),
      totalPrice: { amount: spot.hourlyRate.amount * hours, currency: spot.hourlyRate.currency },
      status,
      notes,
      createdAt: new Date(now - 2 * DAY_MS).toISOString(),
    });
    if (status === "Confirmed") {
      spot.status = "Reserved";
      spot.currentBookingId = id;
      spot.reservedUntil = new Date(end).toISOString();
    }
  };

  addBooking(downtown, 0, DAY_MS, 3, "Confirmed", "Meeting at the main square. Arriving in a white hatchback.");
  addBooking(airport, 9, 3 * DAY_MS, 48, "Confirmed", null);
  addBooking(downtown, 1, -5 * DAY_MS, 2, "Completed", null);
  addBooking(downtown, 2, -9 * DAY_MS, 4, "Cancelled", "Plans changed.");
  addBooking(airport, 8, -14 * DAY_MS, 1, "Expired", null);

  return { lots, bookings };
}

type GlobalWithMock = typeof globalThis & { __parkingMockState?: MockState };
const globalWithMock = globalThis as GlobalWithMock;
const state: MockState = (globalWithMock.__parkingMockState ??= seed());


const BLOCKING_STATUSES = new Set<ParkingSpotResponse["status"]>(["Reserved", "Occupied"]);

function toLotResponse({ lot, spots }: LotRecord): ParkingLotResponse {
  return {
    ...lot,
    totalSpots: spots.length,
    availableSpotsCount: spots.filter((spot) => spot.status === "Available").length,
  };
}

function requireLot(id: string): LotRecord {
  const record = state.lots.get(id);
  if (!record) throw notFound("The parking lot");
  return record;
}

function requireSpot(record: LotRecord, spotId: string): ParkingSpotResponse {
  const spot = record.spots.find((candidate) => candidate.id === spotId);
  if (!spot) throw notFound("The parking spot");
  return spot;
}

function releaseSpot(spot: ParkingSpotResponse) {
  spot.status = "Available";
  spot.currentBookingId = null;
  spot.reservedUntil = null;
}

export const mockStore = {
  listLots(): ParkingLotResponse[] {
    return [...state.lots.values()].map(toLotResponse);
  },

  getLot(id: string): ParkingLotResponse {
    return toLotResponse(requireLot(id));
  },

  createLot(request: CreateParkingLotRequest): { id: string } {
    const id = randomUUID();
    const currency = request.currency ?? "EGP";
    const record: LotRecord = {
      lot: {
        id,
        name: request.name,
        description: request.description,
        location: { latitude: request.latitude, longitude: request.longitude, address: request.address ?? null },
        hourlyRate: { amount: request.hourlyRateAmount, currency },
        isActive: true,
        openingTime: request.openingTime,
        closingTime: request.closingTime,
        createdAt: new Date().toISOString(),
      },
      spots: Array.from({ length: Math.min(request.totalSpots, MAX_GENERATED_SPOTS) }, (_, index) =>
        buildSpot("S", index, request.hourlyRateAmount, currency),
      ),
    };
    state.lots.set(id, record);
    return { id };
  },

  updateLot(
    id: string,
    data: { name: string; description: string; hourlyRateAmount: number; currency?: string },
  ): void {
    const { lot } = requireLot(id);
    lot.name = data.name;
    lot.description = data.description;
    lot.hourlyRate = { amount: data.hourlyRateAmount, currency: data.currency ?? lot.hourlyRate.currency };
    for (const booking of state.bookings.values()) {
      if (booking.parkingLotId === id) booking.parkingLotName = data.name;
    }
  },

  deleteLot(id: string): void {
    const record = requireLot(id);
    if (record.spots.some((spot) => BLOCKING_STATUSES.has(spot.status))) {
      throw new ApiError({
        status: 409,
        title: "Operation conflict.",
        detail: "This lot still has reserved or occupied spots. Release them before deleting the lot.",
      });
    }
    state.lots.delete(id);
  },

  listSpots(lotId: string): ParkingSpotResponse[] {
    return [...requireLot(lotId).spots];
  },

  listAvailableSpots(lotId: string): ParkingSpotResponse[] {
    return requireLot(lotId).spots.filter((spot) => spot.status === "Available");
  },

  addSpot(lotId: string, request: AddSpotRequest): { spotId: string; parkingLotId: string } {
    const record = requireLot(lotId);
    if (record.spots.some((spot) => spot.spotNumber.toLowerCase() === request.spotNumber.toLowerCase())) {
      throw new ApiError({
        status: 409,
        title: "Operation conflict.",
        detail: `Spot ${request.spotNumber} already exists in this lot.`,
      });
    }
    const spot: ParkingSpotResponse = {
      id: randomUUID(),
      spotNumber: request.spotNumber,
      type: {
        size: request.size,
        hasElectricCharger: request.hasElectricCharger ?? false,
        isCovered: request.isCovered ?? false,
        isAccessible: request.isAccessible ?? false,
      },
      status: "Available",
      hourlyRate: { amount: request.hourlyRateAmount, currency: request.currency ?? record.lot.hourlyRate.currency },
      currentBookingId: null,
      reservedUntil: null,
    };
    record.spots.push(spot);
    return { spotId: spot.id, parkingLotId: lotId };
  },

  updateSpot(lotId: string, spotId: string, request: AddSpotRequest): void {
    const record = requireLot(lotId);
    const spot = requireSpot(record, spotId);
    spot.spotNumber = request.spotNumber;
    spot.type = {
      size: request.size,
      hasElectricCharger: request.hasElectricCharger ?? false,
      isCovered: request.isCovered ?? false,
      isAccessible: request.isAccessible ?? false,
    };
    spot.hourlyRate = { amount: request.hourlyRateAmount, currency: request.currency ?? spot.hourlyRate.currency };
  },

  deleteSpot(lotId: string, spotId: string): void {
    const record = requireLot(lotId);
    const spot = requireSpot(record, spotId);
    if (BLOCKING_STATUSES.has(spot.status)) {
      throw new ApiError({
        status: 409,
        title: "Parking spot unavailable.",
        detail: "This spot is reserved or occupied. Release it before deleting.",
      });
    }
    record.spots.splice(record.spots.indexOf(spot), 1);
  },


  listBookings(userId: string): BookingSummary[] {
    return [...state.bookings.values()]
      .filter((booking) => booking.userId === userId)
      .sort((a, b) => Date.parse(b.startTime) - Date.parse(a.startTime));
  },

  createBooking(userId: string, request: CreateBookingRequest): { id: string } {
    const record = requireLot(request.parkingLotId);
    const spot = requireSpot(record, request.parkingSpotId);
    const start = Date.parse(request.startTime);
    const end = Date.parse(request.endTime);

    if (!record.lot.isActive || !isWithinOpeningHours(start, record.lot.openingTime, record.lot.closingTime)) {
      throw new ApiError({
        status: 400,
        title: "Parking lot closed.",
        detail: "The parking lot is closed at the requested start time.",
      });
    }
    if (spot.status !== "Available") throw spotUnavailable();

    const id = randomUUID();
    const hours = billedHours(start, end);
    state.bookings.set(id, {
      id,
      userId,
      parkingLotId: record.lot.id,
      parkingLotName: record.lot.name,
      parkingSpotId: spot.id,
      spotNumber: spot.spotNumber,
      startTime: new Date(start).toISOString(),
      endTime: new Date(end).toISOString(),
      totalPrice: { amount: spot.hourlyRate.amount * hours, currency: spot.hourlyRate.currency },
      status: "Confirmed",
      notes: request.notes ?? null,
      createdAt: new Date().toISOString(),
    });
    spot.status = "Reserved";
    spot.currentBookingId = id;
    spot.reservedUntil = new Date(end).toISOString();
    return { id };
  },

  cancelBooking(bookingId: string, userId: string, isAdmin: boolean): void {
    const booking = state.bookings.get(bookingId);
    if (!booking || (!isAdmin && booking.userId !== userId)) throw notFound("The booking");

    if (booking.status !== "Pending" && booking.status !== "Confirmed") {
      throw new ApiError({
        status: 409,
        title: "Booking state conflict.",
        detail: "The booking cannot move to the requested state.",
      });
    }
    if (Date.parse(booking.startTime) <= Date.now()) {
      throw new ApiError({
        status: 409,
        title: "Booking cannot be cancelled.",
        detail: "The booking can no longer be cancelled.",
      });
    }

    booking.status = "Cancelled";
    const spot = state.lots.get(booking.parkingLotId)?.spots.find((candidate) => candidate.id === booking.parkingSpotId);
    if (spot && spot.currentBookingId === bookingId) releaseSpot(spot);
  },
};
