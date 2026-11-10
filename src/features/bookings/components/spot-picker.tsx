import { Accessibility, Umbrella, Zap } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

import type { ParkingSpotResponse } from "@/features/parkings/types";
import { formatMoney } from "@/lib/utils/format";

interface SpotPickerProps {
  spots: ParkingSpotResponse[];
  registration: UseFormRegisterReturn;
  error?: string;
}

export function SpotPicker({ spots, registration, error }: SpotPickerProps) {
  return (
    <fieldset aria-describedby={error ? "spot-error" : undefined}>
      <legend className="mb-3 text-sm font-medium text-slate-800">Choose a spot</legend>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {spots.map((spot) => (
          <label key={spot.id} className="block cursor-pointer">
            <input type="radio" value={spot.id} className="peer sr-only" {...registration} />
            <span className="flex h-full flex-col gap-2 rounded-xl border border-slate-300 bg-white p-4 transition hover:border-blue-400 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:ring-2 peer-checked:ring-blue-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-700">
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-slate-950">Spot {spot.spotNumber}</span>
                <span className="text-sm font-medium text-slate-700">{formatMoney(spot.hourlyRate)}/h</span>
              </span>
              <span className="text-xs text-slate-600">{spot.type.size}</span>
              <span className="flex flex-wrap gap-1.5">
                {spot.type.hasElectricCharger && <Feature icon={<Zap className="size-3" />} label="EV charger" />}
                {spot.type.isCovered && <Feature icon={<Umbrella className="size-3" />} label="Covered" />}
                {spot.type.isAccessible && <Feature icon={<Accessibility className="size-3" />} label="Accessible" />}
              </span>
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id="spot-error" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}
