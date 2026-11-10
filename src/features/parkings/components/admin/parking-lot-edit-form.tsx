"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField, describedBy, inputClass } from "@/components/ui/form-field";
import { applyServerFieldErrors } from "@/lib/forms/apply-server-errors";

import { updateParkingLotAction } from "../../actions/parkings.actions";
import { updateParkingLotSchema } from "../../schemas";
import type { ParkingLotResponse } from "../../types";

type EditInput = z.input<typeof updateParkingLotSchema>;
type EditOutput = z.output<typeof updateParkingLotSchema>;

const FIELDS = ["name", "description", "hourlyRateAmount", "currency"] as const;

export function ParkingLotEditForm({ lot }: { lot: ParkingLotResponse }) {
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditInput, unknown, EditOutput>({
    resolver: zodResolver(updateParkingLotSchema),
    mode: "onTouched",
    defaultValues: {
      name: lot.name,
      description: lot.description,
      hourlyRateAmount: lot.hourlyRate.amount,
      currency: lot.hourlyRate.currency,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSaved(false);
    const result = await updateParkingLotAction(lot.id, values);
    if (!result.success) {
      setFormError(result.error);
      applyServerFieldErrors(setError, result.fieldErrors, FIELDS);
      return;
    }
    reset(values);
    setSaved(true);
  });

  const nameError = errors.name?.message;
  const descriptionError = errors.description?.message;
  const rateError = errors.hourlyRateAmount?.message;
  const currencyError = errors.currency?.message;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError && <Alert>{formError}</Alert>}
      {saved && <Alert tone="success">Changes saved.</Alert>}

      <FormField id="edit-name" label="Name" error={nameError}>
        <input {...register("name")} id="edit-name" className={inputClass} aria-invalid={Boolean(nameError)} aria-describedby={describedBy("edit-name", { error: nameError })} />
      </FormField>

      <FormField id="edit-description" label="Description" error={descriptionError}>
        <textarea {...register("description")} id="edit-description" rows={3} className={`${inputClass} h-auto py-2.5`} aria-invalid={Boolean(descriptionError)} aria-describedby={describedBy("edit-description", { error: descriptionError })} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="edit-rate" label="Hourly rate" error={rateError}>
          <input {...register("hourlyRateAmount", { valueAsNumber: true })} id="edit-rate" type="number" step="0.01" min="0" inputMode="decimal" className={inputClass} aria-invalid={Boolean(rateError)} aria-describedby={describedBy("edit-rate", { error: rateError })} />
        </FormField>
        <FormField id="edit-currency" label="Currency" error={currencyError}>
          <input {...register("currency")} id="edit-currency" maxLength={3} className={`${inputClass} uppercase`} aria-invalid={Boolean(currencyError)} aria-describedby={describedBy("edit-currency", { error: currencyError })} />
        </FormField>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
