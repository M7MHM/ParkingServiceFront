import { ParkingCircle } from "lucide-react";

import { getParkingLots } from "../api/parkings.service";
import { ParkingLotCard } from "./parking-lot-card";

export async function ParkingLotList() {
  const lots = await getParkingLots();

  if (lots.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <ParkingCircle aria-hidden="true" className="size-10 text-slate-400" />
        <h2 className="mt-4 text-lg font-semibold text-slate-950">No parking lots yet</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          There is nothing to book right now. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {lots.map((lot) => (
        <ParkingLotCard key={lot.id} lot={lot} />
      ))}
    </ul>
  );
}
