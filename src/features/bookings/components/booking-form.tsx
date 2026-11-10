"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import type { ParkingLotResponse, ParkingSpotResponse } from "@/features/parkings/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/form-field";
import { formatMoney, formatTimeSpan } from "@/lib/utils/format";

import { createBookingAction } from "../actions/bookings.actions";
import { BOOKING_ROUTES } from "../constants/routes";
import { createBookingFormSchema } from "../schemas";
import type { BookingFormValues } from "../schemas";
import {
  billedHours,
  datetimeLocalToIso,
  nextQuarterHour,
  parseDatetimeLocal,
  toDatetimeLocalValue,
} from "../utils/booking-time";
import { SpotPicker } from "./spot-picker";

interface BookingFormProps {
  lot: Pick<ParkingLotResponse, "id" | "openingTime" | "closingTime">;
  spots: ParkingSpotResponse[];
}

const FORM_FIELDS = ["parkingSpotId", "startTime", "endTime", "notes"] as const;

function isFormField(name: string): name is (typeof FORM_FIELDS)[number] {
  return (FORM_FIELDS as readonly string[]).includes(name);
}

export function BookingForm({ lot, spots }: BookingFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const schema = useMemo(
    () => createBookingFormSchema({ openingTime: lot.openingTime, closingTime: lot.closingTime }),
    [lot.openingTime, lot.closingTime],
  );

  const [defaultValues] = useState<BookingFormValues>(() => {
    const start = nextQuarterHour();
    return {
      parkingSpotId: "",
      startTime: toDatetimeLocalValue(start),
      endTime: toDatetimeLocalValue(new Date(start.getTime() + 3_600_000)),
      notes: "",
    };
  });

  const {
    register,
    handleSubmit,
    control,
    setError,
    resetField,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues,
  });

  const [spotId, startTime, endTime] = useWatch({ control, name: ["parkingSpotId", "startTime", "endTime"] });
  const estimate = useMemo(() => {
    const spot = spots.find((candidate) => candidate.id === spotId);
    const start = parseDatetimeLocal(startTime ?? "");
    const end = parseDatetimeLocal(endTime ?? "");
    if (!spot || Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;

    const hours = billedHours(start, end);
    return { hours, total: { amount: spot.hourlyRate.amount * hours, currency: spot.hourlyRate.currency } };
  }, [spots, spotId, startTime, endTime]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const result = await createBookingAction({
      parkingLotId: lot.id,
      parkingSpotId: values.parkingSpotId,
      startTime: datetimeLocalToIso(values.startTime),
      endTime: datetimeLocalToIso(values.endTime),
      notes: values.notes.trim() || null,
    });

    if (!result.success) {
      setFormError(result.error);
      if (result.status === 409) {
        // The spot was taken in the meantime: drop the selection and reload the available spots.
        resetField("parkingSpotId");
        router.refresh();
      }
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        if (isFormField(field) && messages[0]) setError(field, { message: messages[0] });
      }
      return;
    }
    router.push(`${BOOKING_ROUTES.LIST}?booked=1`);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {formError && (
        <Alert>{formError}</Alert>
      )}

      <SpotPicker spots={spots} registration={register("parkingSpotId")} error={errors.parkingSpotId?.message} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-start" className="mb-2 block text-sm font-medium text-slate-800">
            Start time
          </label>
          <input
            id="booking-start"
            type="datetime-local"
            step={60}
            aria-invalid={Boolean(errors.startTime)}
            aria-describedby={errors.startTime ? "booking-start-error" : undefined}
            className={inputClass}
            {...register("startTime")}
          />
          {errors.startTime && (
            <p id="booking-start-error" className="mt-1.5 text-sm text-red-700">
              {errors.startTime.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="booking-end" className="mb-2 block text-sm font-medium text-slate-800">
            End time
          </label>
          <input
            id="booking-end"
            type="datetime-local"
            step={60}
            aria-invalid={Boolean(errors.endTime)}
            aria-describedby={errors.endTime ? "booking-end-error" : undefined}
            className={inputClass}
            {...register("endTime")}
          />
          {errors.endTime && (
            <p id="booking-end-error" className="mt-1.5 text-sm text-red-700">
              {errors.endTime.message}
            </p>
          )}
        </div>
        <p className="text-xs text-slate-500 sm:col-span-2">
          Times are in your local timezone. This lot accepts bookings that start between{" "}
          {formatTimeSpan(lot.openingTime)} and {formatTimeSpan(lot.closingTime)} UTC.
        </p>
      </div>

      <div>
        <label htmlFor="booking-notes" className="mb-2 block text-sm font-medium text-slate-800">
          Notes <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          id="booking-notes"
          rows={3}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? "booking-notes-error" : undefined}
          className={`${inputClass} h-auto py-2.5`}
          {...register("notes")}
        />
        {errors.notes && (
          <p id="booking-notes-error" className="mt-1.5 text-sm text-red-700">
            {errors.notes.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-sm text-slate-600">
          {estimate ? (
            <>
              Estimated total:{" "}
              <span className="text-lg font-bold text-slate-950">{formatMoney(estimate.total)}</span>{" "}
              <span className="text-slate-500">
                ({estimate.hours} billed hour{estimate.hours === 1 ? "" : "s"})
              </span>
            </>
          ) : (
            "Pick a spot and valid times to see the price."
          )}
        </p>
        <Button type="submit" loading={isSubmitting || isSubmitSuccessful} className="sm:min-w-44">
          {isSubmitting || isSubmitSuccessful ? "Booking…" : "Confirm booking"}
        </Button>
      </div>
    </form>
  );
}
