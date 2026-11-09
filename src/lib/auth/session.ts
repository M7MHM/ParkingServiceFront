import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "parking_session";

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
