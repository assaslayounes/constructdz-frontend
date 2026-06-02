import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  total?: number;
  current: number;
  labels?: string[];
  compact?: boolean;
}

const fallbackLabels = ["نوع الحساب", "البيانات", "الحساب", "التأكيد"];

export function StepIndicator({ current, labels = fallbackLabels, total = labels.length, compact }: Props) {
  const visibleLabels = labels.slice(0, total);

  return (
    <div className={cn("mx-auto flex w-full items-center justify-center", compact ? "gap-3 px-2" : "gap-0 px-0 sm:px-4 md:px-7")}>
      {visibleLabels.map((label, index) => {
        const step = index + 1;
        const done = step < current;
        const active = step === current;

        return (
          <div key={`${label}-${step}`} className="flex min-w-0 flex-1 items-center last:flex-none">
            <div className="flex min-w-[44px] flex-col items-center gap-2 sm:min-w-[58px]">
              <div
                className={cn(
                  "grid size-10 place-items-center rounded-full text-sm font-bold sm:size-12 sm:text-lg",
                  done && "bg-[#9aa0ff] text-[#08306b]",
                  active && "bg-brand-orange text-black ring-4 ring-[#ffe4d7] sm:ring-8",
                  !done && !active && "bg-[#f4e4dc] text-[#8b766c]"
                )}
              >
                {done ? <Check className="size-4 sm:size-5" /> : step}
              </div>
              <span className={cn("max-w-20 truncate text-[10px] sm:text-xs", active ? "text-brand-brown" : "text-[#8b766c]")}>{label}</span>
            </div>
            {index < visibleLabels.length - 1 && <div className={cn("mb-6 h-0.5 flex-1 sm:h-1", done || active ? "bg-brand-orange" : "bg-[#f1d9cc]")} />}
          </div>
        );
      })}
    </div>
  );
}
