export const USER_ROLES = ["Customer", "Admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];
