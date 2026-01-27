"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-mono tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-accentViolet to-accentIndigo text-white hover:opacity-90 shadow-lg shadow-accentViolet/20",
        primary:
          "bg-gradient-to-r from-accentViolet to-accentIndigo text-white hover:opacity-90 shadow-lg shadow-accentViolet/20",
        secondary:
          "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
        outline:
          "border border-accentViolet/50 text-accentViolet bg-transparent hover:bg-accentViolet/10",
        ghost:
          "text-textSecondary hover:text-white hover:bg-white/5",
        link:
          "text-accentViolet underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
