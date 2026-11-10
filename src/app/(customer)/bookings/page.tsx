import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { BookingsList, BookingsListSkeleton } from "@/features/bookings/components/bookings-list";
import { PARKING_ROUTES } from "@/features/parkings/constants/routes";

export const metadata: Metadata = {
  title: "My bookings | Parking App",
};

export default function CustomerBookingsPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
        <PageHeader
          title="My bookings"
          description="Your upcoming and past reservations."
          actions={
            <Link href={PARKING_ROUTES.LIST} className={buttonStyles({ variant: "secondary" })}>
              Book another spot
            </Link>
          }
        />
        <Suspense fallback={<BookingsListSkeleton />}>
          <BookingsList />
        </Suspense>
      </div>
    </main>
  );
}
