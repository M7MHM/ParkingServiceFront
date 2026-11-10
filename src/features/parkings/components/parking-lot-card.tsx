import { Clock, MapPin } from "lucide-react";
import Link from "next/link";

import { formatMoney, formatTimeSpan } from "@/lib/utils/format";

import { PARKING_ROUTES } from "../constants/routes";
import type { ParkingLotResponse } from "../types";
import { AVAILABILITY_STYLES, getAvailability } from "./parking-lot-status";

export function ParkingLotCard({ lot }: { lot: ParkingLotResponse }) {
  const availability = AVAILABILITY_STYLES[getAvailability(lot)];

  return (
    <li>
      <Link
        href={PARKING_ROUTES.DETAIL(lot.id)}
        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-slate-950 group-hover:text-blue-800">
            {lot.name}
          </h2>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${availability.className}`}>
            {availability.label}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{lot.description}</p>

        <dl className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
            <dt className="sr-only">Address</dt>
            <dd>{lot.location.address ?? "Address not provided"}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Clock aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
            <dt className="sr-only">Opening hours</dt>
            <dd>
              {formatTimeSpan(lot.openingTime)} – {formatTimeSpan(lot.closingTime)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-950">{lot.availableSpotsCount}</span> of {lot.totalSpots} free
          </p>
          <p className="text-right">
            <span className="text-lg font-bold text-slate-950">{formatMoney(lot.hourlyRate)}</span>
            <span className="text-sm text-slate-500"> / hour</span>
          </p>
        </div>
      </Link>
    </li>
  );
}
