import { z } from "zod";

import type { ApiError } from "@/lib/api/client";

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export type ActionFailure = Extract<ActionResult, { success: false }>;

export function failureFromApiError(error: ApiError, message?: string): ActionFailure {
  const hasFieldErrors = Object.keys(error.fieldErrors).length > 0;
  return {
    success: false,
    error: message ?? error.detail ?? error.title,
    ...(hasFieldErrors && { fieldErrors: error.fieldErrors }),
  };
}

export function failureFromValidation(error: z.ZodError): ActionFailure {
  const fieldErrors: Record<string, string[]> = {};
  for (const [field, messages] of Object.entries(z.flattenError(error).fieldErrors)) {
    if (Array.isArray(messages) && messages.length > 0) fieldErrors[field] = messages;
  }
  return { success: false, error: "Please correct the highlighted fields.", fieldErrors };
}
