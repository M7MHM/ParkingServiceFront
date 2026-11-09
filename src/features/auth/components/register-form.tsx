"use client";

import { useActionState } from "react";
import { registerAction } from "../actions/auth.actions";
import { SubmitButton } from "./submit-button";

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, undefined);
  const fullNameError = state?.fieldErrors.fullName?.[0];
  const emailError = state?.fieldErrors.email?.[0];
  const passwordError = state?.fieldErrors.password?.[0];

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state?.message && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="register-full-name" className="mb-2 block text-sm font-medium text-slate-800">
          Full name
        </label>
        <input
          id="register-full-name"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          defaultValue={state?.values.fullName ?? ""}
          aria-invalid={Boolean(fullNameError)}
          aria-describedby={fullNameError ? "register-full-name-error" : undefined}
          className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 aria-invalid:border-red-500"
          placeholder="Your name"
        />
        {fullNameError && <p id="register-full-name-error" className="mt-1.5 text-sm text-red-700">{fullNameError}</p>}
      </div>

      <div>
        <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-slate-800">
          Email address
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.values.email ?? ""}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "register-email-error" : undefined}
          className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 aria-invalid:border-red-500"
          placeholder="you@example.com"
        />
        {emailError && <p id="register-email-error" className="mt-1.5 text-sm text-red-700">{emailError}</p>}
      </div>

      <div>
        <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-slate-800">
          Password
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? "register-password-error" : undefined}
          className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 aria-invalid:border-red-500"
        />
        <p className="mt-1.5 text-xs text-slate-500">Use at least 8 characters.</p>
        {passwordError && <p id="register-password-error" className="mt-1.5 text-sm text-red-700">{passwordError}</p>}
      </div>

      <SubmitButton label="Create account" pendingLabel="Creating account…" />
    </form>
  );
}
