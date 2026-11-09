import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-semibold text-blue-700">Get started</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign up to find parking and keep your bookings together.
        </p>
      </div>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-800">
          Sign in
        </Link>
      </p>
    </section>
  );
}
