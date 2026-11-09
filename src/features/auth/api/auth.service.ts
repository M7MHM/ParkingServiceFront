import { apiClient } from "@/lib/api/client";

import { loginResponseSchema, registerResponseSchema } from "../schemas";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types";

const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
} as const;

/**
 * `POST /api/auth/login` (`LoginCommand`).
 * Pass data already validated with `loginSchema`. Throws `ApiError`: 401 for wrong
 * credentials, 400 for validation failures, 429 when the auth rate limit (10 per minute per IP) is hit.
 */
export function login(request: LoginRequest): Promise<LoginResponse> {
  return apiClient.post(AUTH_ENDPOINTS.login, loginResponseSchema, request, { auth: "none" });
}

/**
 * `POST /api/auth/register` (`RegisterCommand`). New accounts always get the `Customer` role.
 * Pass data already validated with `registerSchema`. Throws `ApiError`: 409 when the email
 * is already registered, 400 for validation failures, 429 when rate limited.
 */
export function register(request: RegisterRequest): Promise<RegisterResponse> {
  return apiClient.post(AUTH_ENDPOINTS.register, registerResponseSchema, request, {
    auth: "none",
  });
}
