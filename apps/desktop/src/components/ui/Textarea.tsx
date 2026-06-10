import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "",
        project:
          "min-h-[140px] resize-y rounded-lg border-[color-mix(in_srgb,var(--apm-radio-silence)_26%,transparent)] bg-[linear-gradient(180deg,rgba(12,27,30,.78),rgba(6,10,16,.86)),repeating-linear-gradient(90deg,rgba(97,191,173,.055)_0_1px,transparent_1px_18px)] leading-normal text-[var(--apm-text-main)] shadow-[inset_0_1px_0_rgba(255,255,255,.08),inset_0_0_22px_rgba(97,191,173,.08)] focus-visible:border-[color-mix(in_srgb,var(--apm-radio-silence)_68%,transparent)] focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_color-mix(in_srgb,var(--apm-radio-silence)_22%,transparent),0_0_24px_color-mix(in_srgb,var(--apm-radio-silence)_18%,transparent),inset_0_0_22px_rgba(97,191,173,.1)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Textarea };
