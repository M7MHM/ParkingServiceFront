import { Suspense } from "react";

import { ParkingLotDetail } from "@/features/parkings/components/parking-lot-detail";

export default function ParkingLotDetailPage({ params }: PageProps<"/parkings/[id]">) {
  return (
    <main className="flex-1 bg-slate-50">
      <Suspense fallback={<DetailSkeleton />}>
        <ParkingLotDetail params={params} />
      </Suspense>
    </main>
  );
}

function DetailSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto w-full max-w-4xl animate-pulse px-5 py-10 sm:px-8">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="mt-5 h-48 rounded-2xl border border-slate-200 bg-white" />
      <div className="mt-8 h-96 rounded-2xl border border-slate-200 bg-white" />
    </div>
  );
}
