import { CircleAlert, CircleCheck, Info } from "lucide-react";
import type { ReactNode } from "react";

type AlertTone = "error" | "success" | "info";

const TONES: Record<AlertTone, { className: string; icon: ReactNode }> = {
  error: { className: "border-red-200 bg-red-50 text-red-800", icon: <CircleAlert className="size-4" /> },
  success: { className: "border-emerald-200 bg-emerald-50 text-emerald-800", icon: <CircleCheck className="size-4" /> },
  info: { className: "border-blue-200 bg-blue-50 text-blue-800", icon: <Info className="size-4" /> },
};

export function Alert({ tone = "error", children }: { tone?: AlertTone; children: ReactNode }) {
  const { className, icon } = TONES[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${className}`}
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0">
        {icon}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
