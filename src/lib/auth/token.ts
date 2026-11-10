import { accessTokenClaimsSchema } from "@/features/auth/schemas";
import type { AccessTokenClaims } from "@/features/auth/types";
import { unstable_noStore as noStore } from 'next/cache';

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

export function decodeAccessToken(token: string): AccessTokenClaims | null {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
      noStore();
    const parsed = accessTokenClaimsSchema.safeParse(JSON.parse(decodeBase64Url(payload)));
    if (!parsed.success) return null;
    return parsed.data.exp * 1000 > Date.now() ? parsed.data : null;
  } catch {
    return null;
  }
}
