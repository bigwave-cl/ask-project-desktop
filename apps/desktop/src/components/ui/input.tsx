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
          "h-11 rounded-lg border-[color-mix(in_srgb,var(--apm-radio-silence)_26%,transparent)] bg-[linear-gradient(180deg,rgba(12,27,30,.78),rgba(6,10,16,.86)),repeating-linear-gradient(90deg,rgba(97,191,173,.055)_0_1px,transparent_1px_18px)] text-[var(--apm-text-main)] shadow-[inset_0_1px_0_rgba(255,255,255,.08),inset_0_0_22px_rgba(97,191,173,.08)] focus-visible:border-[color-mix(in_srgb,var(--apm-radio-silence)_68%,transparent)] focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_color-mix(in_srgb,var(--apm-radio-silence)_22%,transparent),0_0_24px_color-mix(in_srgb,var(--apm-radio-silence)_18%,transparent),inset_0_0_22px_rgba(97,191,173,.1)]",
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
