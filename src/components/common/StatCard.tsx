import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, icon: Icon }: Props) {
  return (
    <article className="rounded-lg border border-brand-border/70 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-muted">{label}</p>
          <p className="mt-2 text-2xl font-extrabold text-brand-ink">{value}</p>
        </div>
        <span className="grid size-11 place-items-center rounded-lg bg-brand-bg text-brand-orange">
          <Icon className="size-5" />
        </span>
      </div>
    </article>
  );
}
