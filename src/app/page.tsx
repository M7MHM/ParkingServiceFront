import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center bg-slate-950 px-5 py-16 text-white sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Parking, made simpler
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            Find a spot. Get where you need to be.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Explore parking options, check availability, and keep your bookings in one place.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/parkings"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-500 px-6 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Explore parking
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Create an account
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-300 hover:text-blue-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
