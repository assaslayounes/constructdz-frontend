import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="flex flex-col gap-4 py-6 sm:py-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-ink sm:text-3xl lg:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-7 text-brand-muted sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
