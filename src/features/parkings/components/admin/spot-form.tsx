"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField, describedBy, inputClass } from "@/components/ui/form-field";
import { applyServerFieldErrors } from "@/lib/forms/apply-server-errors";

import { addSpotAction, updateSpotAction } from "../../actions/parkings.actions";
import { addSpotSchema } from "../../schemas";
import type { AddSpotFormInput, AddSpotFormOutput } from "../../schemas";
import { SPOT_SIZES } from "../../types";
import type { ParkingSpotResponse } from "../../types";

const FIELDS = ["spotNumber", "size", "hourlyRateAmount", "currency"] as const;

interface SpotFormProps {
  lotId: string;
  defaultCurrency: string;
  defaultRate: number;
  spot?: ParkingSpotResponse;
  onDone: () => void;
  onCancel: () => void;
}

export function SpotForm({ lotId, defaultCurrency, defaultRate, spot, onDone, onCancel }: SpotFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddSpotFormInput, unknown, AddSpotFormOutput>({
    resolver: zodResolver(addSpotSchema),
    mode: "onTouched",
    defaultValues: spot
      ? {
          spotNumber: spot.spotNumber,
          size: spot.type.size,
          hourlyRateAmount: spot.hourlyRate.amount,
          currency: spot.hourlyRate.currency,
          hasElectricCharger: spot.type.hasElectricCharger,
          isCovered: spot.type.isCovered,
          isAccessible: spot.type.isAccessible,
        }
      : { size: "Standard", hourlyRateAmount: defaultRate, currency: defaultCurrency },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const result = spot
      ? await updateSpotAction(lotId, spot.id, values)
      : await addSpotAction(lotId, values);
    if (!result.success) {
      setFormError(result.error);
      applyServerFieldErrors(setError, result.fieldErrors, FIELDS);
      return;
    }
    onDone();
  });

  const numberError = errors.spotNumber?.message;
  const sizeError = errors.size?.message;
  const rateError = errors.hourlyRateAmount?.message;
  const currencyError = errors.currency?.message;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-blue-200 bg-blue-50/40 p-4 sm:p-5">
      <h3 className="font-semibold text-slate-950">{spot ? `Edit spot ${spot.spotNumber}` : "Add a spot"}</h3>
      {formError && <Alert>{formError}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="spot-number" label="Spot number" error={numberError}>
          <input {...register("spotNumber")} id="spot-number" className={inputClass} autoComplete="off" aria-invalid={Boolean(numberError)} aria-describedby={describedBy("spot-number", { error: numberError })} />
        </FormField>
        <FormField id="spot-size" label="Size" error={sizeError}>
          <select {...register("size")} id="spot-size" className={inputClass} aria-invalid={Boolean(sizeError)} aria-describedby={describedBy("spot-size", { error: sizeError })}>
            {SPOT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="spot-rate" label="Hourly rate" error={rateError}>
          <input {...register("hourlyRateAmount", { valueAsNumber: true })} id="spot-rate" type="number" step="0.01" min="0" inputMode="decimal" className={inputClass} aria-invalid={Boolean(rateError)} aria-describedby={describedBy("spot-rate", { error: rateError })} />
        </FormField>
        <FormField id="spot-currency" label="Currency" error={currencyError}>
          <input {...register("currency")} id="spot-currency" maxLength={3} className={`${inputClass} uppercase`} aria-invalid={Boolean(currencyError)} aria-describedby={describedBy("spot-currency", { error: currencyError })} />
        </FormField>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-800">Features</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="size-4 rounded border-slate-300" {...register("hasElectricCharger")} />
            EV charger
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="size-4 rounded border-slate-300" {...register("isCovered")} />
            Covered
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="size-4 rounded border-slate-300" {...register("isAccessible")} />
            Accessible
          </label>
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {spot ? "Save spot" : "Add spot"}
        </Button>
      </div>
    </form>
  );
}
