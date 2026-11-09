import type { Guid, IsoDateTime } from "@/types/common";

import type { UserRole } from "./enums";

/** Response of `POST /api/auth/login` (`LoginResponse`). */
export interface LoginResponse {
  token: string;
  expiresAt: IsoDateTime;
  userId: Guid;
  fullName: string;
  role: UserRole;
}

/** Response of `POST /api/auth/register` (HTTP 201). */
export interface RegisterResponse {
  userId: Guid;
}
