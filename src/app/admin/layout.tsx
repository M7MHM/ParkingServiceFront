import { Suspense } from "react";
import type { ReactNode } from "react";

import { Spinner } from "@/components/ui/spinner";
import { AdminGate } from "@/features/parkings/components/admin/admin-gate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 bg-slate-50">
      <Suspense
        fallback={
          <div className="flex justify-center py-24 text-slate-500">
            <Spinner className="size-6" label="Loading admin panel" />
          </div>
        }
      >
        <AdminGate>{children}</AdminGate>
      </Suspense>
    </main>
  );
}
