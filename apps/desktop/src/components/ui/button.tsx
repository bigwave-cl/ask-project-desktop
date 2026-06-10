import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        projectGhost:
          "border border-[color-mix(in_srgb,currentColor_22%,transparent)] bg-transparent text-[color-mix(in_srgb,var(--apm-swan-dive)_76%,transparent)] hover:border-[color-mix(in_srgb,var(--apm-swan-dive)_34%,transparent)] hover:bg-[color-mix(in_srgb,var(--apm-swan-dive)_7%,transparent)] hover:text-[var(--apm-text-main)]",
        projectPrimary:
          "border border-[color-mix(in_srgb,currentColor_22%,transparent)] bg-[linear-gradient(135deg,var(--apm-radio-silence),var(--apm-swan-dive))] text-[#061211] shadow-[0_0_18px_color-mix(in_srgb,var(--apm-radio-silence)_24%,transparent),inset_0_1px_0_rgba(255,255,255,.34)]",
        projectDanger:
          "border border-[color-mix(in_srgb,currentColor_22%,transparent)] bg-[linear-gradient(135deg,var(--apm-riviera),color-mix(in_srgb,var(--apm-radio-silence)_58%,var(--apm-riviera)))] text-[#14080a] shadow-[0_0_18px_color-mix(in_srgb,var(--apm-riviera)_24%,transparent),inset_0_1px_0_rgba(255,255,255,.34)] hover:shadow-[0_0_26px_color-mix(in_srgb,var(--apm-riviera)_34%,transparent),0_0_18px_color-mix(in_srgb,var(--apm-radio-silence)_16%,transparent),inset_0_1px_0_rgba(255,255,255,.42)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
        project: "min-h-[38px] min-w-[92px] rounded-lg px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
