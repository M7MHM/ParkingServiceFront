/** .NET `Guid`, serialized as a lowercase hyphenated string. */
export type Guid = string;

/** .NET `DateTime` / `DateTimeOffset`, serialized as an ISO 8601 string. */
export type IsoDateTime = string;

/** .NET `TimeSpan`, serialized as `[d.]hh:mm:ss[.fffffff]` (e.g. `08:00:00`, `1.00:00:00`). */
export type TimeSpan = string;

/** Mirrors `ParkingBooking.Domain.ValueObjects.Money`. */
export interface Money {
  amount: number;
  currency: string;
}
