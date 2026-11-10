import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { isMockApi } from "@/lib/api/mock-mode";

import { getLotSpots, getParkingLotById } from "../../api/parkings.service";
import { ADMIN_ROUTES, PARKING_ROUTES } from "../../constants/routes";
import { parkingLotIdParamsSchema } from "../../schemas";
import { DeleteParkingLotButton } from "./delete-parking-lot-button";
import { ParkingLotEditForm } from "./parking-lot-edit-form";
import { SpotManager } from "./spot-manager";

async function load(lotId: string) {
  try {
    const [lot, spots] = await Promise.all([getParkingLotById(lotId), getLotSpots(lotId)]);
    return { lot, spots };
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  }
}

export async function AdminParkingLotDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = parkingLotIdParamsSchema.safeParse({ lotId: id });
  if (!parsed.success) notFound();

  const { lot, spots } = await load(parsed.data.lotId);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-10 sm:px-8">
      <div>
        <Link href={ADMIN_ROUTES.LIST} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800">
          <ArrowLeft aria-hidden="true" className="size-4" />
          All parking lots
        </Link>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{lot.name}</h1>
            <Badge tone={lot.isActive ? "green" : "slate"}>{lot.isActive ? "Active" : "Inactive"}</Badge>
          </div>
          <Link href={PARKING_ROUTES.DETAIL(lot.id)} className={buttonStyles({ variant: "secondary", size: "sm" })}>
            <ExternalLink aria-hidden="true" className="size-4" />
            View public page
          </Link>
        </div>
      </div>

      <section aria-labelledby="details-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 id="details-heading" className="mb-5 text-lg font-semibold text-slate-950">
          Details
        </h2>
        <ParkingLotEditForm lot={lot} />
      </section>

      <section aria-labelledby="spots-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 id="spots-heading" className="mb-5 text-lg font-semibold text-slate-950">
          Spots
        </h2>
        <SpotManager lot={lot} spots={spots} availableOnly={!isMockApi()} />
      </section>

      <section aria-labelledby="danger-heading" className="rounded-2xl border border-red-200 bg-white p-5 sm:p-6">
        <h2 id="danger-heading" className="text-lg font-semibold text-red-700">
          Danger zone
        </h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Deleting a lot removes all of its spots. This cannot be undone.</p>
          <DeleteParkingLotButton lotId={lot.id} lotName={lot.name} redirectTo={ADMIN_ROUTES.LIST} variant="danger" label="Delete this lot" />
        </div>
      </section>
    </div>
  );
}
