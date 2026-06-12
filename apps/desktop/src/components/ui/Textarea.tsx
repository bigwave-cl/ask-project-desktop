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
          "min-h-[140px] resize-y rounded-lg border-apm-radio-26 bg-apm-control-field leading-normal text-[var(--apm-text-main)] shadow-apm-control-field focus-visible:border-apm-radio-68 focus-visible:ring-0 focus-visible:shadow-apm-control-field-focus",
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
