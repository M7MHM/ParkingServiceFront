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

export function login(request: LoginRequest): Promise<LoginResponse> {
  return apiClient.post(AUTH_ENDPOINTS.login, loginResponseSchema, request, { auth: "none" });
}

export function register(request: RegisterRequest): Promise<RegisterResponse> {
  return apiClient.post(AUTH_ENDPOINTS.register, registerResponseSchema, request, {
    auth: "none",
  });
}
