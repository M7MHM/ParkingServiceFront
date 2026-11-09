import { z } from "zod";

import { getSessionToken } from "@/lib/auth/session";
import {
  problemDetailsSchema,
  validationProblemDetailsSchema,
} from "@/lib/schemas/problem-details";
import type { ProblemDetails } from "@/types/api";

const DEFAULT_TIMEOUT_MS = 15_000;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * - `auto`: attach `Authorization: Bearer <jwt>` when the session cookie exists.
 * - `none`: never attach a token (anonymous endpoints such as login and register).
 */
export type AuthMode = "auto" | "none";

export interface ApiRequestOptions {
  method?: HttpMethod;
  /** Serialized as JSON. */
  body?: unknown;
  auth?: AuthMode;
  headers?: HeadersInit;
  /** Defaults to `no-store` unless `next` is provided, so per-user data is never cached. */
  cache?: RequestCache;
  next?: RequestInit["next"];
  signal?: AbortSignal;
  timeoutMs?: number;
}

type RequestOptionsWithoutBody = Omit<ApiRequestOptions, "method" | "body">;

interface ApiErrorInit {
  status: number;
  title: string;
  detail?: string | null;
  traceId?: string | null;
  problem?: ProblemDetails | null;
  fieldErrors?: Record<string, string[]>;
  cause?: unknown;
}

/**
 * Lowercases the first letter of each dotted segment: the backend reports FluentValidation
 * failures as `Email` / `FullName`, while form fields are camelCase (`email` / `fullName`).
 */
function toCamelCaseKey(key: string): string {
  return key.replace(
    /(^|\.)([A-Z])/g,
    (_match, dot: string, letter: string) => dot + letter.toLowerCase(),
  );
}

function normalizeFieldErrors(errors: Record<string, string[]>): Record<string, string[]> {
  const normalized: Record<string, string[]> = {};
  for (const [key, messages] of Object.entries(errors)) {
    const camelKey = toCamelCaseKey(key);
    normalized[camelKey] = [...(normalized[camelKey] ?? []), ...messages];
  }
  return normalized;
}

/**
 * Every failed request ends up here: an `application/problem+json` response from
 * `ApiExceptionMiddleware`, an empty-bodied response (e.g. 429 from the rate limiter),
 * a network failure or timeout (`status` 0), or a response that doesn't match its schema.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail: string | null;
  readonly traceId: string | null;
  readonly problem: ProblemDetails | null;
  /** Validation messages keyed by camelCase field name. Empty unless the API returned HTTP 400 with `errors`. */
  readonly fieldErrors: Record<string, string[]>;

  constructor(init: ApiErrorInit) {
    super(init.detail ? `${init.title} ${init.detail}` : init.title, { cause: init.cause });
    this.name = "ApiError";
    this.status = init.status;
    this.title = init.title;
    this.detail = init.detail ?? null;
    this.traceId = init.traceId ?? null;
    this.problem = init.problem ?? null;
    this.fieldErrors = init.fieldErrors ?? {};
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }
  get isValidationError(): boolean {
    return this.status === 400;
  }
  get isUnauthorized(): boolean {
    return this.status === 401;
  }
  get isForbidden(): boolean {
    return this.status === 403;
  }
  get isNotFound(): boolean {
    return this.status === 404;
  }
  get isConflict(): boolean {
    return this.status === 409;
  }
  get isRateLimited(): boolean {
    return this.status === 429;
  }
}

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local and restart the dev server.",
    );
  }
  return baseUrl.replace(/\/+$/, "");
}

function buildUrl(path: string): string {
  return `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

async function buildHeaders(options: ApiRequestOptions): Promise<Headers> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if ((options.auth ?? "auto") === "auto" && !headers.has("Authorization")) {
    const token = await getSessionToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return headers;
}

function buildSignal(options: ApiRequestOptions): AbortSignal {
  const timeoutSignal = AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  return options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal;
}

function parseJson(text: string): unknown {
  try {
    return text ? JSON.parse(text) : undefined;
  } catch {
    return undefined;
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  const fallbackTitle = response.statusText || `Request failed with status ${response.status}.`;
  const text = await response.text().catch(() => "");
  const json = parseJson(text);

  const validation = validationProblemDetailsSchema.safeParse(json);
  if (validation.success) {
    return new ApiError({
      status: response.status,
      title: validation.data.title ?? fallbackTitle,
      detail: validation.data.detail,
      traceId: validation.data.traceId,
      problem: validation.data,
      fieldErrors: normalizeFieldErrors(validation.data.errors),
    });
  }

  const problem = problemDetailsSchema.safeParse(json);
  const data = problem.success ? problem.data : null;
  return new ApiError({
    status: response.status,
    title: data?.title ?? fallbackTitle,
    detail: data?.detail,
    traceId: data?.traceId,
    problem: data,
  });
}

async function parseSuccessBody<S extends z.ZodType>(
  response: Response,
  schema: S,
): Promise<z.output<S>> {
  const text = await response.text();
  const json = parseJson(text);

  if (text && json === undefined) {
    throw new ApiError({
      status: response.status,
      title: "The server returned an unreadable response.",
    });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiError({
      status: response.status,
      title: "The server returned an unexpected response.",
      detail: z.prettifyError(parsed.error),
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * Sends a request to the Parking API.
 *
 * - With a `schema`, the JSON body is validated and returned fully typed.
 * - Without one (commands that answer `204 No Content`), the body is discarded and `void` is returned.
 * - Throws `ApiError` for every failure.
 *
 * Server-only: it reads the session cookie through `next/headers`, so importing it from a
 * Client Component fails the build. Because that read happens at request time, don't call
 * it from inside a `"use cache"` scope.
 */
export async function apiRequest<S extends z.ZodType>(
  path: string,
  options: ApiRequestOptions & { schema: S },
): Promise<z.output<S>>;
export async function apiRequest(path: string, options?: ApiRequestOptions): Promise<void>;
export async function apiRequest(
  path: string,
  options: ApiRequestOptions & { schema?: z.ZodType } = {},
): Promise<unknown> {
  const init: RequestInit = {
    method: options.method ?? "GET",
    headers: await buildHeaders(options),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: buildSignal(options),
    next: options.next,
    cache: options.cache ?? (options.next ? undefined : "no-store"),
  };

  let response: Response;
  try {
    response = await fetch(buildUrl(path), init);
  } catch (error) {
    if (options.signal?.aborted) throw error;

    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    throw new ApiError({
      status: 0,
      title: timedOut ? "The request timed out." : "Unable to reach the server.",
      cause: error,
    });
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (!options.schema) {
    await response.body?.cancel();
    return undefined;
  }
  return parseSuccessBody(response, options.schema);
}

/** Thin helpers over `apiRequest` for the common "send and parse the typed response" case. */
export const apiClient = {
  get<S extends z.ZodType>(
    path: string,
    schema: S,
    options: RequestOptionsWithoutBody = {},
  ): Promise<z.output<S>> {
    return apiRequest(path, { ...options, method: "GET", schema });
  },

  post<S extends z.ZodType>(
    path: string,
    schema: S,
    body?: unknown,
    options: RequestOptionsWithoutBody = {},
  ): Promise<z.output<S>> {
    return apiRequest(path, { ...options, method: "POST", body, schema });
  },
};
