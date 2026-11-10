import { ArrowLeft, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingForm } from "@/features/bookings/components/booking-form";
import { ApiError } from "@/lib/api/client";
import { AUTH_ROUTES, REDIRECT_PARAM } from "@/lib/auth/constants";
import { getSessionToken } from "@/lib/auth/session";
import { formatMoney, formatTimeSpan } from "@/lib/utils/format";

import { getAvailableSpots, getParkingLotById } from "../api/parkings.service";
import { PARKING_ROUTES } from "../constants/routes";
import { parkingLotIdParamsSchema } from "../schemas";
import { AVAILABILITY_STYLES, getAvailability } from "./parking-lot-status";

async function loadParkingLot(lotId: string) {
  try {
    const [lot, spots] = await Promise.all([getParkingLotById(lotId), getAvailableSpots(lotId)]);
    return { lot, spots };
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }
}

export async function ParkingLotDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = parkingLotIdParamsSchema.safeParse({ lotId: id });
  if (!parsedId.success) notFound();

  const lotId = parsedId.data.lotId;
  const [{ lot, spots }, session] = await Promise.all([loadParkingLot(lotId), getSessionToken()]);
  const availability = AVAILABILITY_STYLES[getAvailability(lot)];

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <Link
        href={PARKING_ROUTES.LIST}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All parking lots
      </Link>

      <header className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{lot.name}</h1>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${availability.className}`}>
            {availability.label}
          </span>
        </div>
        <p className="mt-3 leading-7 text-slate-600">{lot.description}</p>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
          <div className="flex items-start gap-2">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-400" />
            <div>
              <dt className="text-slate-500">Address</dt>
              <dd className="font-medium text-slate-900">{lot.location.address ?? "Not provided"}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-400" />
            <div>
              <dt className="text-slate-500">Opening hours</dt>
              <dd className="font-medium text-slate-900">
                {formatTimeSpan(lot.openingTime)} – {formatTimeSpan(lot.closingTime)}
              </dd>
            </div>
          </div>
          <div>
            <dt className="text-slate-500">Standard rate</dt>
            <dd className="font-medium text-slate-900">{formatMoney(lot.hourlyRate)} / hour</dd>
          </div>
        </dl>
      </header>

      <section aria-labelledby="book-heading" className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 id="book-heading" className="text-xl font-semibold text-slate-950">
          Book a spot
        </h2>
        <p className="mt-1 mb-6 text-sm text-slate-600">
          {spots.length} spot{spots.length === 1 ? "" : "s"} available right now.
        </p>

        {!lot.isActive ? (
          <Notice title="This lot is closed" body="It isn't accepting bookings at the moment." />
        ) : spots.length === 0 ? (
          <Notice title="No spots available" body="Every spot is taken right now. Please check back later." />
        ) : !session ? (
          <Notice
            title="Sign in to book"
            body="You need an account to reserve a spot."
            action={
              <Link
                href={`${AUTH_ROUTES.LOGIN}?${REDIRECT_PARAM}=${encodeURIComponent(PARKING_ROUTES.DETAIL(lot.id))}`}
                className="inline-flex h-11 items-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Sign in
              </Link>
            }
          />
        ) : (
          <BookingForm lot={lot} spots={spots} />
        )}
      </section>
    </div>
  );
}

function Notice({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
      <div>
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{body}</p>
      </div>
      {action}
    </div>
  );
}
