import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";
import { ParkingLotCreateForm } from "@/features/parkings/components/admin/parking-lot-create-form";
import { ADMIN_ROUTES } from "@/features/parkings/constants/routes";

export const metadata: Metadata = {
  title: "New parking lot | Parking App",
};

export default function NewParkingLotPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8">
      <Link href={ADMIN_ROUTES.LIST} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800">
        <ArrowLeft aria-hidden="true" className="size-4" />
        All parking lots
      </Link>
      <PageHeader title="New parking lot" description="Set up the basics. You can add and edit spots afterwards." />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <ParkingLotCreateForm />
      </div>
    </div>
  );
}
