import type { LoginRequest, LoginResponse, RegisterResponse, UserRole } from "@/features/auth/types";

import { DEMO_ADMIN_ID, DEMO_CUSTOMER_ID } from "./constants";

const SESSION_HOURS = 8;

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "user";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function mockLogin({ email }: LoginRequest): LoginResponse {
  const role: UserRole = email.trim().toLowerCase().startsWith("admin") ? "Admin" : "Customer";
  const userId = role === "Admin" ? DEMO_ADMIN_ID : DEMO_CUSTOMER_ID;
  const fullName = role === "Admin" ? "Demo Admin" : nameFromEmail(email);
  const exp = Math.floor(Date.now() / 1000) + SESSION_HOURS * 3_600;

  const token = [
    encode({ alg: "none", typ: "JWT" }),
    encode({ sub: userId, email, name: fullName, role, exp, iss: "parking-mock", aud: "parking-web" }),
    "mock-signature",
  ].join(".");

  return { token, expiresAt: new Date(exp * 1000).toISOString(), userId, fullName, role };
}

export function mockRegister(): RegisterResponse {
  return { userId: DEMO_CUSTOMER_ID };
}
