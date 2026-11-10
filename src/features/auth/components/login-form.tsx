"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { REDIRECT_PARAM } from "@/lib/auth/constants";
import { loginAction } from "../actions/auth.actions";
import { SubmitButton } from "./submit-button";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, undefined);
  const redirectTo = useSearchParams().get(REDIRECT_PARAM) ?? "";
  const emailError = state?.fieldErrors.email?.[0];
  const passwordError = state?.fieldErrors.password?.[0];

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state?.message && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </p>
      )}

      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div>
        <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-800">
          Email address
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.values.email ?? ""}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "login-email-error" : undefined}
          className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 aria-invalid:border-red-500"
          placeholder="you@example.com"
        />
        {emailError && <p id="login-email-error" className="mt-1.5 text-sm text-red-700">{emailError}</p>}
      </div>

      <div>
        <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-800">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "login-password-error" : undefined}
          className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 aria-invalid:border-red-500"
        />
        {passwordError && <p id="login-password-error" className="mt-1.5 text-sm text-red-700">{passwordError}</p>}
      </div>

      <SubmitButton label="Sign in" pendingLabel="Signing in…" />
    </form>
  );
}
