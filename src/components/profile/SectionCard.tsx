import type { ReactNode } from "react";

type Props = {
  title: string;
  action?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ title, action, icon, children }: Props) {
  return (
    <section className="rounded-lg border border-brand-border bg-white px-6 py-7 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="text-brand-brown">{action}</div>
        <h2 className="flex items-center gap-2 text-right text-3xl text-black">
          {title}
          <span className="text-brand-brown">{icon}</span>
        </h2>
      </div>
      {children}
    </section>
  );
}
