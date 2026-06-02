import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "outline" | "ghost" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", asChild, ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-200 active:scale-[.98] disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        // Sizes
        size === "sm" && "h-10 rounded-xl px-4 text-sm",
        size === "md" && "h-12 rounded-xl px-6 text-base",
        size === "lg" && "h-14 rounded-2xl px-8 text-lg",
        // Variants
        variant === "primary" && "bg-gradient-to-b from-primary-500 to-primary-600 text-white shadow-[0_2px_8px_rgba(217,119,6,0.3)] hover:from-primary-600 hover:to-primary-700 hover:shadow-[0_4px_16px_rgba(217,119,6,0.35)]",
        variant === "secondary" && "bg-gradient-to-b from-secondary-600 to-secondary-700 text-white shadow-[0_2px_8px_rgba(30,58,138,0.25)] hover:from-secondary-700 hover:to-secondary-800",
        variant === "outline" && "border-2 border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700",
        variant === "ghost" && "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        variant === "danger" && "bg-error-600 text-white hover:bg-error-700 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
