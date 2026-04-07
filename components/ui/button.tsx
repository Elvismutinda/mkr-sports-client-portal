import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider",
  {
    variants: {
      variant: {
        primary:
          "bg-mkr-yellow hover:bg-mkr-yellow-hover text-mkr-navy shadow-lg shadow-mkr-yellow/10",
        secondary:
          "bg-mkr-slate hover:bg-slate-700 text-white border border-slate-600",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        ghost:
          "bg-transparent hover:bg-mkr-slate text-slate-300 hover:text-white",
        destructive:
          "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/10",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "p-2",
      },
    },
  }
);

function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
