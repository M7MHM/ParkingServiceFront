import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AUTH_ROUTES, REDIRECT_PARAM } from "@/lib/auth/constants";
import { getCurrentUser } from "@/lib/auth/session";

import { ADMIN_ROUTES } from "../../constants/routes";

export async function AdminGate({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`${AUTH_ROUTES.LOGIN}?${REDIRECT_PARAM}=${encodeURIComponent(ADMIN_ROUTES.LIST)}`);
  }

  if (user.role !== "Admin") {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16">
        <EmptyState
          icon={<ShieldAlert />}
          title="Administrators only"
          description="Your account does not have access to the admin panel."
          action={
            <Link href="/" className={buttonStyles({ variant: "secondary" })}>
              Back to home
            </Link>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
