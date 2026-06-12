import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "border-input bg-background text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "",
        project:
          "h-11 rounded-lg border-apm-radio-26 bg-apm-control-field text-[var(--apm-text-main)] shadow-apm-control-field focus-visible:border-apm-radio-68 focus-visible:ring-0 focus-visible:shadow-apm-control-field-focus",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Input({
  className,
  type,
  variant,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Input };
