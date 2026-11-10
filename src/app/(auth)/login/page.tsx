import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-semibold text-blue-700">Welcome back</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Sign in to Parking App</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Manage your parking plans and bookings in one place.
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-slate-600">
        New to Parking App?{" "}
        <Link href="/register" className="font-semibold text-blue-700 hover:text-blue-800">
          Create an account
        </Link>
      </p>
    </section>
  );
}
