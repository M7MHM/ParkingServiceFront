import type { Guid } from "@/types/common";

import type { UserRole } from "./enums";

/**
 * Claims issued by `JwtTokenGenerator`. The API sets `MapInboundClaims = false`,
 * so the short claim names (`sub`, `name`, `role`) are used as-is.
 */
export interface AccessTokenClaims {
  sub: Guid;
  email: string;
  name: string;
  role: UserRole;
  /** Expiry as seconds since the Unix epoch. */
  exp: number;
  iss: string;
  aud: string;
}
