"use client";

import { Accessibility, Pencil, Plus, Trash2, Umbrella, Zap } from "lucide-react";
import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import type { BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/utils/format";

import { deleteSpotAction } from "../../actions/parkings.actions";
import type { ParkingLotResponse, ParkingSpotResponse, SpotStatus } from "../../types";
import { SpotForm } from "./spot-form";

const STATUS_TONE: Record<SpotStatus, BadgeTone> = {
  Available: "green",
  Reserved: "amber",
  Occupied: "red",
  Maintenance: "slate",
  Disabled: "slate",
};

const IN_USE: SpotStatus[] = ["Reserved", "Occupied"];

type Editing = "new" | ParkingSpotResponse | null;

interface SpotManagerProps {
  lot: Pick<ParkingLotResponse, "id" | "hourlyRate">;
  spots: ParkingSpotResponse[];
  /** True when the list only contains available spots (the real API cannot list the rest). */
  availableOnly: boolean;
}

export function SpotManager({ lot, spots, availableOnly }: SpotManagerProps) {
  const [editing, setEditing] = useState<Editing>(null);
  const [toDelete, setToDelete] = useState<ParkingSpotResponse | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    if (!toDelete) return;
    const spot = toDelete;
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteSpotAction(lot.id, spot.id);
      if (!result.success) {
        setDeleteError(result.error);
        return;
      }
      setToDelete(null);
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {spots.length} spot{spots.length === 1 ? "" : "s"}
          {availableOnly && " (available spots only)"}
        </p>
        {editing === null && (
          <Button size="sm" onClick={() => setEditing("new")}>
            <Plus aria-hidden="true" className="size-4" />
            Add spot
          </Button>
        )}
      </div>

      {editing !== null && (
        <SpotForm
          key={editing === "new" ? "new" : editing.id}
          lotId={lot.id}
          defaultCurrency={lot.hourlyRate.currency}
          defaultRate={lot.hourlyRate.amount}
          spot={editing === "new" ? undefined : editing}
          onDone={() => setEditing(null)}
          onCancel={() => setEditing(null)}
        />
      )}

      {spots.length === 0 ? (
        <EmptyState
          icon={<Plus />}
          title="No spots yet"
          description="Add the first spot so customers can book this lot."
        />
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {spots.map((spot) => (
            <li key={spot.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-950">Spot {spot.spotNumber}</span>
                  <Badge tone={STATUS_TONE[spot.status]}>{spot.status}</Badge>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                  <span>{spot.type.size}</span>
                  <span>{formatMoney(spot.hourlyRate)}/h</span>
                  {spot.type.hasElectricCharger && <Feature icon={<Zap className="size-3.5" />} label="EV" />}
                  {spot.type.isCovered && <Feature icon={<Umbrella className="size-3.5" />} label="Covered" />}
                  {spot.type.isAccessible && <Feature icon={<Accessibility className="size-3.5" />} label="Accessible" />}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" size="sm" onClick={() => setEditing(spot)}>
                  <Pencil aria-hidden="true" className="size-4" />
                  Edit
                  <span className="sr-only"> spot {spot.spotNumber}</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={IN_USE.includes(spot.status)}
                  title={IN_USE.includes(spot.status) ? "Release this spot before deleting it" : undefined}
                  onClick={() => {
                    setDeleteError(null);
                    setToDelete(spot);
                  }}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  Delete
                  <span className="sr-only"> spot {spot.spotNumber}</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title={toDelete ? `Delete spot ${toDelete.spotNumber}?` : "Delete spot?"}
        description="The spot is removed from this lot and can no longer be booked."
        confirmLabel="Delete spot"
        pending={pending}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
}
