import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  icon: ReactNode;
  active?: boolean;
}

export function CategoryChip({ label, icon, active }: Props) {
  return (
    <div className="flex min-w-[60px] flex-col items-center gap-2 sm:min-w-0">
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-150 active:scale-95 sm:h-16 sm:w-16",
          active
            ? "bg-amber-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.35)]"
            : "bg-neutral-100 text-neutral-600 hover:bg-amber-50 hover:text-amber-700"
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "truncate text-[11px] font-semibold sm:text-xs",
          active ? "text-amber-700" : "text-neutral-600"
        )}
      >
        {label}
      </span>
    </div>
  );
}
