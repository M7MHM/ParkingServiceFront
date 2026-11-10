import type { Metadata } from "next";
import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { AdminParkingLotDetail } from "@/features/parkings/components/admin/admin-parking-lot-detail";

export const metadata: Metadata = {
  title: "Edit parking lot | Parking App",
};

export default function AdminParkingLotPage({ params }: PageProps<"/admin/parkings/[id]">) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24 text-slate-500">
          <Spinner className="size-6" label="Loading parking lot" />
        </div>
      }
    >
      <AdminParkingLotDetail params={params} />
    </Suspense>
  );
}
