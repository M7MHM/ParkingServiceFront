import type { Guid } from "@/types/common";

import type { UserRole } from "./enums";

export interface AccessTokenClaims {
  sub: Guid;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
  iss: string;
  aud: string;
}
