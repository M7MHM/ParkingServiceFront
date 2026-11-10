import type { Money } from "@/types/common";

import { timeSpanToSeconds } from "./time-span";

export function formatMoney({ amount, currency }: Money): string {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatTimeSpan(value: string): string {
  const total = timeSpanToSeconds(value);
  if (total === null) return value;

  const hours = Math.floor(total / 3_600);
  const minutes = Math.floor((total % 3_600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
