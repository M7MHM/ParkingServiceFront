"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField, describedBy, inputClass } from "@/components/ui/form-field";
import { applyServerFieldErrors } from "@/lib/forms/apply-server-errors";

import { createParkingLotAction } from "../../actions/parkings.actions";
import { ADMIN_ROUTES } from "../../constants/routes";
import { createParkingLotSchema } from "../../schemas";
import type { CreateParkingLotFormInput, CreateParkingLotFormOutput } from "../../schemas";

const FIELDS = [
  "name",
  "description",
  "address",
  "latitude",
  "longitude",
  "hourlyRateAmount",
  "currency",
  "totalSpots",
  "openingTime",
  "closingTime",
] as const;

export function ParkingLotCreateForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<CreateParkingLotFormInput, unknown, CreateParkingLotFormOutput>({
    resolver: zodResolver(createParkingLotSchema),
    mode: "onTouched",
    defaultValues: { currency: "EGP", openingTime: "08:00", closingTime: "22:00", totalSpots: 20 },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await createParkingLotAction(values);
    if (!result.success) {
      setFormError(result.error);
      applyServerFieldErrors(setError, result.fieldErrors, FIELDS);
      return;
    }
    router.push(result.data ? ADMIN_ROUTES.EDIT(result.data.id) : ADMIN_ROUTES.LIST);
  });

  const field = (name: (typeof FIELDS)[number], hint?: string) => {
    const error = errors[name]?.message;
    return { id: `lot-${name}`, error, hint, "aria-invalid": Boolean(error), "aria-describedby": describedBy(`lot-${name}`, { error, hint }) };
  };

  const name = field("name");
  const description = field("description");
  const address = field("address");
  const latitude = field("latitude");
  const longitude = field("longitude");
  const rate = field("hourlyRateAmount");
  const currency = field("currency");
  const totalSpots = field("totalSpots", "Spots are created automatically; you can add or edit them afterwards.");
  const opening = field("openingTime");
  const closing = field("closingTime");

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {formError && <Alert>{formError}</Alert>}

      <FormField {...name} label="Name">
        <input {...register("name")} id={name.id} className={inputClass} aria-invalid={name["aria-invalid"]} aria-describedby={name["aria-describedby"]} autoComplete="off" />
      </FormField>

      <FormField {...description} label="Description">
        <textarea {...register("description")} id={description.id} rows={3} className={`${inputClass} h-auto py-2.5`} aria-invalid={description["aria-invalid"]} aria-describedby={description["aria-describedby"]} />
      </FormField>

      <FormField {...address} label="Address" optional>
        <input {...register("address")} id={address.id} className={inputClass} aria-invalid={address["aria-invalid"]} aria-describedby={address["aria-describedby"]} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField {...latitude} label="Latitude">
          <input {...register("latitude", { valueAsNumber: true })} id={latitude.id} type="number" step="any" inputMode="decimal" className={inputClass} aria-invalid={latitude["aria-invalid"]} aria-describedby={latitude["aria-describedby"]} />
        </FormField>
        <FormField {...longitude} label="Longitude">
          <input {...register("longitude", { valueAsNumber: true })} id={longitude.id} type="number" step="any" inputMode="decimal" className={inputClass} aria-invalid={longitude["aria-invalid"]} aria-describedby={longitude["aria-describedby"]} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField {...rate} label="Hourly rate">
          <input {...register("hourlyRateAmount", { valueAsNumber: true })} id={rate.id} type="number" step="0.01" min="0" inputMode="decimal" className={inputClass} aria-invalid={rate["aria-invalid"]} aria-describedby={rate["aria-describedby"]} />
        </FormField>
        <FormField {...currency} label="Currency">
          <input {...register("currency")} id={currency.id} maxLength={3} className={`${inputClass} uppercase`} aria-invalid={currency["aria-invalid"]} aria-describedby={currency["aria-describedby"]} />
        </FormField>
        <FormField {...totalSpots} label="Total spots">
          <input {...register("totalSpots", { valueAsNumber: true })} id={totalSpots.id} type="number" min="1" step="1" inputMode="numeric" className={inputClass} aria-invalid={totalSpots["aria-invalid"]} aria-describedby={totalSpots["aria-describedby"]} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField {...opening} label="Opening time">
          <input {...register("openingTime")} id={opening.id} type="time" className={inputClass} aria-invalid={opening["aria-invalid"]} aria-describedby={opening["aria-describedby"]} />
        </FormField>
        <FormField {...closing} label="Closing time">
          <input {...register("closingTime")} id={closing.id} type="time" className={inputClass} aria-invalid={closing["aria-invalid"]} aria-describedby={closing["aria-describedby"]} />
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={() => router.push(ADMIN_ROUTES.LIST)} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting || isSubmitSuccessful}>
          Create parking lot
        </Button>
      </div>
    </form>
  );
}
