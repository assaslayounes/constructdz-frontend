import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props { label: string; icon: ReactNode; active?: boolean; }

export function CategoryChip({ label, icon, active }: Props) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <div className={cn("grid size-16 place-items-center rounded-2xl text-brand-brown sm:size-[72px]", active ? "bg-brand-orange text-white" : "bg-[#f6ded3]")}>{icon}</div>
      <span className="truncate text-xs font-bold text-black sm:text-sm">{label}</span>
    </div>
  );
}
