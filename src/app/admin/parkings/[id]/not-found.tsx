import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { ADMIN_ROUTES } from "@/features/parkings/constants/routes";

export default function AdminParkingLotNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-950">Parking lot not found</h1>
      <p className="mt-2 text-slate-600">It may have been deleted.</p>
      <Link href={ADMIN_ROUTES.LIST} className={buttonStyles({ className: "mt-6" })}>
        Back to parking lots
      </Link>
    </div>
  );
}
