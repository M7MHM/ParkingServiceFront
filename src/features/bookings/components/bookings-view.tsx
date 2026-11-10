"use client";

import { CalendarX } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Alert } from "@/components/ui/alert";
import { buttonStyles } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { PARKING_ROUTES } from "@/features/parkings/constants/routes";

import { cancelBookingAction } from "../actions/bookings.actions";
import type { BookingSummary } from "../types";
import { BookingCard } from "./booking-card";

type Filter = "upcoming" | "past" | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "all", label: "All" },
];

function isUpcoming(booking: BookingSummary, now: number): boolean {
  return (booking.status === "Pending" || booking.status === "Confirmed") && Date.parse(booking.endTime) > now;
}

export function BookingsView({ bookings }: { bookings: BookingSummary[] }) {
  const justBooked = useSearchParams().get("booked") === "1";
  const [now] = useState(() => Date.now());
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [target, setTarget] = useState<BookingSummary | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const counts: Record<Filter, number> = {
    upcoming: bookings.filter((booking) => isUpcoming(booking, now)).length,
    past: bookings.filter((booking) => !isUpcoming(booking, now)).length,
    all: bookings.length,
  };
  const visible = bookings.filter((booking) =>
    filter === "all" ? true : filter === "upcoming" ? isUpcoming(booking, now) : !isUpcoming(booking, now),
  );

  function confirmCancel() {
    if (!target) return;
    const booking = target;
    setCancelError(null);
    startTransition(async () => {
      const result = await cancelBookingAction(booking.id);
      if (!result.success) {
        setCancelError(result.error);
        return;
      }
      setNotice(`Your booking at ${booking.parkingLotName} was cancelled.`);
      setTarget(null);
    });
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={<CalendarX />}
        title="No bookings yet"
        description="When you reserve a parking spot it will show up here."
        action={
          <Link href={PARKING_ROUTES.LIST} className={buttonStyles()}>
            Find a parking spot
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      {justBooked && !notice && <Alert tone="success">Your spot is booked. See you there!</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}

      <div role="tablist" aria-label="Filter bookings" className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            onClick={() => setFilter(value)}
            className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
            }`}
          >
            {label} <span className="text-slate-400">{counts[value]}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<CalendarX />}
          title={filter === "upcoming" ? "No upcoming bookings" : "No past bookings"}
          description="Nothing to show in this view."
        />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {visible.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              now={now}
              onCancel={(selected) => {
                setCancelError(null);
                setTarget(selected);
              }}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={target !== null}
        title="Cancel this booking?"
        description={
          target
            ? `Your reservation at ${target.parkingLotName} (spot ${target.spotNumber}) will be cancelled and the spot released for others.`
            : ""
        }
        confirmLabel="Yes, cancel booking"
        cancelLabel="Keep booking"
        pending={pending}
        error={cancelError}
        onConfirm={confirmCancel}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
