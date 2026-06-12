import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-semibold whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
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
          "border border-apm-current-22 bg-transparent text-[color-mix(in_srgb,var(--apm-swan-dive)_76%,transparent)] hover:border-apm-swan-34 hover:bg-apm-button-ghost-hover hover:text-[var(--apm-text-main)] focus-visible:border-apm-radio-44 focus-visible:ring-0 focus-visible:shadow-apm-button-ghost-focus",
        projectPrimary:
          "border border-apm-current-22 bg-apm-button-primary text-[#061211] shadow-apm-button-primary focus-visible:border-apm-radio-70 focus-visible:ring-0 focus-visible:shadow-apm-button-primary-focus",
        projectDanger:
          "border border-apm-current-22 bg-apm-button-danger text-[#14080a] shadow-apm-button-danger hover:shadow-apm-button-danger-hover focus-visible:border-apm-riviera-70 focus-visible:ring-0 focus-visible:shadow-apm-button-danger-focus",
        projectPlain:
          "border-0 bg-transparent p-0 text-inherit shadow-none hover:bg-transparent hover:text-inherit focus-visible:border-transparent focus-visible:ring-0 focus-visible:shadow-none",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
        project: "min-h-[38px] min-w-[92px] rounded-lg px-4 py-2",
        projectPlain: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
