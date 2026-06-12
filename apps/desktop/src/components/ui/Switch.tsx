import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent p-[3px] shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "h-[1.15rem] w-8 bg-input data-[state=checked]:bg-primary dark:bg-input/80",
        project:
          "h-[28px] w-[48px] border-apm-switch-accent-28 bg-apm-switch-track transition-[border-color,background,box-shadow] duration-[160ms] data-[state=checked]:border-apm-switch-accent-62 data-[state=checked]:bg-apm-switch-checked data-[state=checked]:shadow-apm-switch-checked focus-visible:border-apm-switch-accent-56 focus-visible:ring-0 focus-visible:shadow-apm-switch-focus",
      },
      tone: {
        mint:
          "[--apm-switch-accent:var(--apm-radio-silence)] [--apm-switch-accent-soft:var(--apm-swan-dive)]",
        cyan:
          "[--apm-switch-accent:var(--apm-late-homework)] [--apm-switch-accent-soft:var(--apm-radio-silence)]",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "mint",
    },
  }
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-background ring-0 transition-transform data-[state=unchecked]:translate-x-0",
  {
    variants: {
      variant: {
        default:
          "size-4 data-[state=checked]:translate-x-[calc(100%-2px)]",
        project:
          "h-5 w-5 bg-apm-switch-thumb shadow-apm-switch-thumb transition-[transform,background] duration-[160ms] data-[state=checked]:translate-x-5 data-[state=checked]:bg-apm-switch-thumb-checked",
      },
      tone: {
        mint: "",
        cyan: "",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "mint",
    },
  }
);

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchVariants> & {
    thumbClassName?: string;
  };

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, thumbClassName, variant, tone, ...props }, ref) => (
    <SwitchPrimitive.Root
      data-slot="switch"
      ref={ref}
      className={cn(switchVariants({ variant, tone, className }))}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(switchThumbVariants({ variant, tone, className: thumbClassName }))}
      />
    </SwitchPrimitive.Root>
  )
);
Switch.displayName = "Switch";

export { Switch };
