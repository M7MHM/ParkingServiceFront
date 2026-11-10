import type { Guid, IsoDateTime } from "@/types/common";
export interface CreateBookingRequest {
  parkingLotId: Guid;
  parkingSpotId: Guid;
  startTime: IsoDateTime;
  endTime: IsoDateTime;
  notes?: string | null;
}
