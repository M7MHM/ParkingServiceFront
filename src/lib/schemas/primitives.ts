import { z } from "zod";

import { timeSpanToSeconds } from "@/lib/utils/time-span";
import type { Money } from "@/types/common";

export const DEFAULT_CURRENCY = "EGP";

export const guidSchema = z.guid({ error: "Must be a valid identifier." });

export const isoDateTimeSchema = z.iso.datetime({ offset: true, local: true });

export const isoDateTimeWithOffsetSchema = z.iso.datetime({
  offset: true,
  error: "Must include a timezone, such as Z or +02:00.",
});

export const timeSpanSchema = z
  .string()
  .refine((value) => timeSpanToSeconds(value) !== null, "Must be a valid TimeSpan.");

export const currencyCodeSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/, "Currency must be a three-letter code.")
  .transform((value) => value.toUpperCase());

function hasAtMostTwoDecimals(value: number): boolean {
  const cents = value * 100;
  return Math.abs(cents - Math.round(cents)) < 1e-8;
}

export const moneyAmountSchema = z
  .number({ error: "Amount must be a number." })
  .min(0, "Amount cannot be negative.")
  .refine(hasAtMostTwoDecimals, "Amount cannot have more than two decimal places.");

export const moneySchema = z.object({
  amount: z.number().min(0),
  currency: z.string().regex(/^[A-Z]{3}$/),
}) satisfies z.ZodType<Money>;
