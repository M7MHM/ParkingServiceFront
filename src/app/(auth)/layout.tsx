import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-lg font-bold tracking-tight text-slate-950"
        >
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-blue-700 text-white">
            P
          </span>
          Parking App
        </Link>
        {children}
      </div>
    </main>
  );
}
