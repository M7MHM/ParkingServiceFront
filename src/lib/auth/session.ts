import { cookies } from "next/headers";
import { cache } from "react";

import type { UserRole } from "@/features/auth/types";

import { SESSION_COOKIE_NAME } from "./constants";
import { decodeAccessToken } from "./token";

export { SESSION_COOKIE_NAME };

const ISO_OFFSET_SUFFIX = /(?:Z|[+-]\d{2}:\d{2})$/i;

function parseExpiry(expiresAt: Date | string): Date {
  const expires =
    expiresAt instanceof Date
      ? expiresAt
      : new Date(ISO_OFFSET_SUFFIX.test(expiresAt) ? expiresAt : `${expiresAt}Z`);

  if (Number.isNaN(expires.getTime())) {
    throw new TypeError("Cannot create a session: `expiresAt` is not a valid date.");
  }
  return expires;
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return token ? token : null;
}

export async function setSessionToken(token: string, expiresAt: Date | string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: parseExpiry(expiresAt),
  });
}

export async function clearSessionToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = await getSessionToken();
  const claims = token ? decodeAccessToken(token) : null;
  return claims ? { id: claims.sub, email: claims.email, name: claims.name, role: claims.role } : null;
});
