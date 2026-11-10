import { apiClient } from "@/lib/api/client";
import { isMockApi } from "@/lib/api/mock-mode";
import { mockLogin, mockRegister } from "@/mocks/auth.mock";

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

export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (isMockApi()) return mockLogin(request);
  return apiClient.post(AUTH_ENDPOINTS.login, loginResponseSchema, request, { auth: "none" });
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  if (isMockApi()) return mockRegister();
  return apiClient.post(AUTH_ENDPOINTS.register, registerResponseSchema, request, {
    auth: "none",
  });
}
