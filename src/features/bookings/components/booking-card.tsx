import { CalendarClock, ChevronDown, MapPin } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LocalTime } from "@/components/ui/local-time";
import { PARKING_ROUTES } from "@/features/parkings/constants/routes";
import { formatMoney } from "@/lib/utils/format";

import type { BookingStatus, BookingSummary } from "../types";
import { billedHours } from "../utils/booking-time";

const STATUS_TONE: Record<BookingStatus, BadgeTone> = {
  Pending: "amber",
  Confirmed: "green",
  Cancelled: "slate",
  Completed: "blue",
  Expired: "slate",
};

export function isCancellable(booking: BookingSummary, now: number): boolean {
  return (booking.status === "Pending" || booking.status === "Confirmed") && Date.parse(booking.startTime) > now;
}

interface BookingCardProps {
  booking: BookingSummary;
  now: number;
  onCancel: (booking: BookingSummary) => void;
}

export function BookingCard({ booking, now, onCancel }: BookingCardProps) {
  const hours = billedHours(Date.parse(booking.startTime), Date.parse(booking.endTime));

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-950">
            <Link href={PARKING_ROUTES.DETAIL(booking.parkingLotId)} className="hover:text-blue-800">
              {booking.parkingLotName}
            </Link>
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin aria-hidden="true" className="size-4 text-slate-400" />
            Spot {booking.spotNumber}
          </p>
        </div>
        <Badge tone={STATUS_TONE[booking.status]}>{booking.status}</Badge>
      </div>

      <div className="mt-4 flex items-start gap-2 text-sm text-slate-700">
        <CalendarClock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-400" />
        <p>
          <LocalTime iso={booking.startTime} /> <span className="text-slate-400">→</span>{" "}
          <LocalTime iso={booking.endTime} />
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-lg font-bold text-slate-950">{formatMoney(booking.totalPrice)}</p>
        {isCancellable(booking, now) && (
          <Button variant="secondary" size="sm" onClick={() => onCancel(booking)}>
            Cancel booking
          </Button>
        )}
      </div>

      <details className="group mt-3">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800">
          Details
          <ChevronDown aria-hidden="true" className="size-4 transition group-open:rotate-180" />
        </summary>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <Detail label="Booking ID" value={<span className="break-all font-mono text-xs">{booking.id}</span>} />
          <Detail label="Booked on" value={<LocalTime iso={booking.createdAt} />} />
          <Detail label="Billed duration" value={`${hours} hour${hours === 1 ? "" : "s"}`} />
          <Detail label="Notes" value={booking.notes ?? "None"} />
        </dl>
      </details>
    </li>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-900">{value}</dd>
    </div>
  );
}
