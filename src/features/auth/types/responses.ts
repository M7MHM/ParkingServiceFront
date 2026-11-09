import type { Guid, IsoDateTime } from "@/types/common";

import type { UserRole } from "./enums";

export interface LoginResponse {
  token: string;
  expiresAt: IsoDateTime;
  userId: Guid;
  fullName: string;
  role: UserRole;
}
export interface RegisterResponse {
  userId: Guid;
}
