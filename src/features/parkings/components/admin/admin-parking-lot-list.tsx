import { ParkingCircle, Pencil, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/utils/format";

import { getParkingLots } from "../../api/parkings.service";
import { ADMIN_ROUTES } from "../../constants/routes";
import { AVAILABILITY_STYLES, getAvailability } from "../parking-lot-status";
import { DeleteParkingLotButton } from "./delete-parking-lot-button";

export async function AdminParkingLotList() {
  const lots = await getParkingLots();

  if (lots.length === 0) {
    return (
      <EmptyState
        icon={<ParkingCircle />}
        title="No parking lots yet"
        description="Create your first parking lot to start accepting bookings."
        action={
          <Link href={ADMIN_ROUTES.NEW} className={buttonStyles()}>
            <Plus aria-hidden="true" className="size-4" />
            New parking lot
          </Link>
        }
      />
    );
  }

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {lots.map((lot) => {
        const availability = AVAILABILITY_STYLES[getAvailability(lot)];
        return (
          <li key={lot.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-semibold text-slate-950">{lot.name}</h2>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${availability.className}`}>
                  {availability.label}
                </span>
                {!lot.isActive && <Badge tone="slate">Inactive</Badge>}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {lot.availableSpotsCount} of {lot.totalSpots} spots free · {formatMoney(lot.hourlyRate)}/h
                {lot.location.address && ` · ${lot.location.address}`}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href={ADMIN_ROUTES.EDIT(lot.id)} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                <Pencil aria-hidden="true" className="size-4" />
                Manage
                <span className="sr-only"> {lot.name}</span>
              </Link>
              <DeleteParkingLotButton lotId={lot.id} lotName={lot.name} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminParkingLotListSkeleton() {
  return (
    <ul aria-busy="true" aria-label="Loading parking lots" className="animate-pulse divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {[0, 1, 2, 3].map((key) => (
        <li key={key} className="space-y-2 p-5">
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="h-3 w-2/3 rounded bg-slate-100" />
        </li>
      ))}
    </ul>
  );
}
