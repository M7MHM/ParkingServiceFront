"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { ButtonVariant } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { deleteParkingLotAction } from "../../actions/parkings.actions";

interface DeleteParkingLotButtonProps {
  lotId: string;
  lotName: string;
  redirectTo?: string;
  variant?: ButtonVariant;
  label?: string;
}

export function DeleteParkingLotButton({
  lotId,
  lotName,
  redirectTo,
  variant = "secondary",
  label = "Delete",
}: DeleteParkingLotButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteParkingLotAction(lotId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setOpen(false);
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    });
  }

  return (
    <>
      <Button
        variant={variant}
        size="sm"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        <Trash2 aria-hidden="true" className="size-4" />
        {label}
        <span className="sr-only"> {lotName}</span>
      </Button>
      <ConfirmDialog
        open={open}
        title={`Delete ${lotName}?`}
        description="This permanently removes the parking lot and all of its spots. This cannot be undone."
        confirmLabel="Delete parking lot"
        pending={pending}
        error={error}
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
