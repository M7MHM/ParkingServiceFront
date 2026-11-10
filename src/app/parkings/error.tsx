"use client";

import { TriangleAlert } from "lucide-react";

export default function ParkingsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-5 py-16">
      <div role="alert" className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <TriangleAlert aria-hidden="true" className="mx-auto size-9 text-red-600" />
        <h1 className="mt-4 text-xl font-semibold text-slate-950">We couldn&apos;t load parking data</h1>
        <p className="mt-2 text-sm text-slate-600">{error.message || "Something went wrong. Please try again."}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
