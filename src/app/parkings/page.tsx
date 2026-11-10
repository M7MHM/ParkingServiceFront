import type { Metadata } from "next";
import { Suspense } from "react";

import { ParkingLotList } from "@/features/parkings/components/parking-lot-list";
import { ParkingLotListSkeleton } from "@/features/parkings/components/parking-lot-list-skeleton";

export const metadata: Metadata = {
  title: "Parking lots | Parking App",
  description: "Browse parking lots, compare prices and check availability.",
};

export default function ParkingLotsPage() {
  return (
    <main className="flex-1 bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <header className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Parking lots</h1>
          <p className="mt-2 text-slate-600">Pick a lot to see its available spots and book a time slot.</p>
        </header>
        <Suspense fallback={<ParkingLotListSkeleton />}>
          <ParkingLotList />
        </Suspense>
      </div>
    </main>
  );
}
