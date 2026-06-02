import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  error?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => (
    <div
      className={cn(
        "relative flex h-12 items-center rounded-xl border bg-white px-4 transition-all duration-200 sm:h-14 sm:px-5",
        "focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100",
        error
          ? "border-error-300 bg-error-50/30"
          : "border-neutral-200 hover:border-neutral-300",
        className
      )}
    >
      <input
        ref={ref}
        className="h-full w-full bg-transparent text-left text-base text-neutral-800 outline-none placeholder:text-neutral-400 sm:text-lg"
        {...props}
      />
      {icon && (
        <span className="mr-3 flex-shrink-0 text-neutral-400 [&_svg]:size-5 sm:[&_svg]:size-6">
          {icon}
        </span>
      )}
    </div>
  )
);
Input.displayName = "Input";
