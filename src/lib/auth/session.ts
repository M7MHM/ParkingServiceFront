import { cookies } from "next/headers";

/** Name of the httpOnly cookie that stores the API's JWT. */
export const SESSION_COOKIE_NAME = "parking_session";

/** Matches a trailing `Z` or `+hh:mm` / `-hh:mm` offset on an ISO 8601 timestamp. */
const ISO_OFFSET_SUFFIX = /(?:Z|[+-]\d{2}:\d{2})$/i;

/**
 * Parses the API's `expiresAt`. The backend builds it from `DateTime.UtcNow`, so a value
 * without an offset is treated as UTC rather than as the server's local time.
 */
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

/**
 * Reads the JWT from the request cookies. Returns `null` when the user is signed out.
 * This is a request-time read, so callers in a Server Component must sit under `<Suspense>`.
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return token ? token : null;
}

/**
 * Stores the JWT in an httpOnly cookie that expires together with the token.
 * Can only be called from a Server Function or a Route Handler.
 */
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

/**
 * Removes the session cookie (sign out).
 * Can only be called from a Server Function or a Route Handler.
 */
export async function clearSessionToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
