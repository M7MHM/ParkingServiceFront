/** Mirrors `Parking.Domain.Enums.UserRole`. The API serializes enums as strings only. */
export const USER_ROLES = ["Customer", "Admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];
