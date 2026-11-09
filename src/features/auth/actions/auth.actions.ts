"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { ApiError } from "@/lib/api/client";
import { clearSessionToken, setSessionToken } from "@/lib/auth/session";

import { login, register } from "../api/auth.service";
import { loginSchema, registerSchema } from "../schemas";
import type { LoginFormInput, RegisterFormInput } from "../schemas";

const DEFAULT_REDIRECT_PATH = "/";
const LOGIN_PATH = "/login";

export interface AuthFormError {
  message: string;
  fieldErrors: Record<string, string[]>;
  traceId: string | null;
  values: Partial<Record<"email" | "fullName", string>>;
}

export type AuthActionState = AuthFormError | undefined;

export type LoginActionInput = LoginFormInput & { redirectTo?: string };
export type RegisterActionInput = RegisterFormInput;

type Attempt<T> = { ok: true; data: T } | { ok: false; error: ApiError };

async function attempt<T>(request: () => Promise<T>): Promise<Attempt<T>> {
  try {
    return { ok: true, data: await request() };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, error };
    throw error;
  }
}

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function safeRedirectPath(path: string | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return DEFAULT_REDIRECT_PATH;
  }
  return path;
}

function describeApiError(error: ApiError): string {
  if (error.isRateLimited) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  if (error.isNetworkError) {
    return error.title;
  }
  if (error.status < 400) {
    return "The server returned an unexpected response. Please try again.";
  }
  return error.detail ?? error.title;
}

function fromApiError(error: ApiError, values: AuthFormError["values"]): AuthFormError {
  return {
    message: describeApiError(error),
    fieldErrors: error.fieldErrors,
    traceId: error.traceId,
    values,
  };
}

function fromValidationError(error: z.ZodError, values: AuthFormError["values"]): AuthFormError {
  const fieldErrors: Record<string, string[]> = {};
  for (const [field, messages] of Object.entries(z.flattenError(error).fieldErrors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      fieldErrors[field] = messages;
    }
  }
  return {
    message: "Please correct the highlighted fields.",
    fieldErrors,
    traceId: null,
    values,
  };
}

export async function loginAction(
  _previousState: AuthActionState,
  input: FormData | LoginActionInput,
): Promise<AuthFormError> {
  const raw: LoginActionInput =
    input instanceof FormData
      ? {
          email: readField(input, "email"),
          password: readField(input, "password"),
          redirectTo: readField(input, "redirectTo"),
        }
      : input;
  const values = { email: raw.email };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return fromValidationError(parsed.error, values);

  const result = await attempt(() => login(parsed.data));
  if (!result.ok) return fromApiError(result.error, values);

  await setSessionToken(result.data.token, result.data.expiresAt);
  redirect(safeRedirectPath(raw.redirectTo));
}

export async function registerAction(
  _previousState: AuthActionState,
  input: FormData | RegisterActionInput,
): Promise<AuthFormError> {
  const raw: RegisterActionInput =
    input instanceof FormData
      ? {
          email: readField(input, "email"),
          password: readField(input, "password"),
          fullName: readField(input, "fullName"),
        }
      : input;
  const values = { email: raw.email, fullName: raw.fullName };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return fromValidationError(parsed.error, values);

  const registration = await attempt(() => register(parsed.data));
  if (!registration.ok) {
    const failure = fromApiError(registration.error, values);

    if (registration.error.isConflict && !failure.fieldErrors.email) {
      failure.fieldErrors = { ...failure.fieldErrors, email: [failure.message] };
    }
    return failure;
  }

  const session = await attempt(() =>
    login({ email: parsed.data.email, password: parsed.data.password }),
  );
  if (!session.ok) {
    redirect(`${LOGIN_PATH}?registered=1`);
  }

  await setSessionToken(session.data.token, session.data.expiresAt);
  redirect(DEFAULT_REDIRECT_PATH);
}

export async function logoutAction(): Promise<void> {
  await clearSessionToken();
  redirect(LOGIN_PATH);
}
