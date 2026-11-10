import Link from "next/link";
import { Suspense } from "react";

import { ADMIN_ROUTES, PARKING_ROUTES } from "@/features/parkings/constants/routes";
import { BOOKING_ROUTES } from "@/features/bookings/constants/routes";
import { isMockApi } from "@/lib/api/mock-mode";
import { getCurrentUser } from "@/lib/auth/session";

import { SiteNav } from "./site-nav";
import type { NavLink } from "./site-nav";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-950">
      <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg bg-blue-700 text-white">
        P
      </span>
      Parking App
    </Link>
  );
}

async function HeaderNav() {
  const user = await getCurrentUser();

  const links: NavLink[] = [{ href: PARKING_ROUTES.LIST, label: "Parking lots" }];
  if (user) links.push({ href: BOOKING_ROUTES.LIST, label: "My bookings" });
  if (user?.role === "Admin") links.push({ href: ADMIN_ROUTES.LIST, label: "Admin" });

  return <SiteNav links={links} userName={user?.name ?? null} />;
}

export function SiteHeader() {
  return (
    <>
      {isMockApi() && (
        <p className="bg-amber-100 px-4 py-1.5 text-center text-xs font-medium text-amber-900">
          Preview mode: all data is demo data and resets when the server restarts.
        </p>
      )}
      <header className="relative border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-8">
          <Brand />
          <Suspense>
            <HeaderNav />
          </Suspense>
        </div>
      </header>
    </>
  );
}
