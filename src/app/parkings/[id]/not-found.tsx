import Link from "next/link";

import { PARKING_ROUTES } from "@/features/parkings/constants/routes";

export default function ParkingLotNotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-5 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-950">Parking lot not found</h1>
        <p className="mt-2 text-slate-600">It may have been removed, or the link is incorrect.</p>
        <Link
          href={PARKING_ROUTES.LIST}
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Browse parking lots
        </Link>
      </div>
    </main>
  );
}
