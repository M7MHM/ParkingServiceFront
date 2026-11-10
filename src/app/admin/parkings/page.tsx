import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { buttonStyles } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ADMIN_ROUTES } from "@/features/parkings/constants/routes";
import {
  AdminParkingLotList,
  AdminParkingLotListSkeleton,
} from "@/features/parkings/components/admin/admin-parking-lot-list";

export const metadata: Metadata = {
  title: "Manage parking lots | Parking App",
};

export default function AdminParkingLotsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
      <PageHeader
        title="Parking lots"
        description="Create, edit and remove parking lots and manage their spots."
        actions={
          <Link href={ADMIN_ROUTES.NEW} className={buttonStyles()}>
            <Plus aria-hidden="true" className="size-4" />
            New parking lot
          </Link>
        }
      />
      <Suspense fallback={<AdminParkingLotListSkeleton />}>
        <AdminParkingLotList />
      </Suspense>
    </div>
  );
}
