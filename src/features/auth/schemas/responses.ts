import { z } from "zod";

import { guidSchema, isoDateTimeSchema } from "@/lib/schemas/primitives";

import { USER_ROLES } from "../types";
import type { AccessTokenClaims, LoginResponse, RegisterResponse } from "../types";

export const userRoleSchema = z.enum(USER_ROLES);

export const loginResponseSchema = z.object({
  token: z.string().min(1),
  expiresAt: isoDateTimeSchema,
  userId: guidSchema,
  fullName: z.string(),
  role: userRoleSchema,
}) satisfies z.ZodType<LoginResponse>;

export const registerResponseSchema = z.object({
  userId: guidSchema,
}) satisfies z.ZodType<RegisterResponse>;

export const accessTokenClaimsSchema = z.object({
  sub: guidSchema,
  email: z.string(),
  name: z.string(),
  role: userRoleSchema,
  exp: z.number().int().positive(),
  iss: z.string(),
  aud: z.string(),
}) satisfies z.ZodType<AccessTokenClaims>;
