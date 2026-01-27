"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-lg",
          "focus:outline-none focus:border-accentViolet/50 focus:bg-accentViolet/5",
          "transition-all placeholder:text-white/20 text-white/90",
          "[color-scheme:dark]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
