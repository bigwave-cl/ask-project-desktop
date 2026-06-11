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
          "h-[28px] w-[48px] border-[color-mix(in_srgb,var(--apm-switch-accent,var(--apm-radio-silence))_28%,transparent)] bg-[rgba(5,13,18,.72)] transition-[border-color,background,box-shadow] duration-[160ms] data-[state=checked]:border-[color-mix(in_srgb,var(--apm-switch-accent,var(--apm-radio-silence))_62%,transparent)] data-[state=checked]:bg-[linear-gradient(135deg,color-mix(in_srgb,var(--apm-switch-accent,var(--apm-radio-silence))_54%,rgba(5,13,18,.72)),color-mix(in_srgb,var(--apm-switch-accent-soft,var(--apm-swan-dive))_34%,rgba(5,13,18,.72)))] data-[state=checked]:shadow-[0_0_14px_color-mix(in_srgb,var(--apm-switch-accent,var(--apm-radio-silence))_22%,transparent)] focus-visible:border-[color-mix(in_srgb,var(--apm-switch-accent,var(--apm-radio-silence))_56%,transparent)] focus-visible:ring-0 focus-visible:shadow-[0_0_0_1px_color-mix(in_srgb,var(--apm-switch-accent,var(--apm-radio-silence))_24%,transparent),0_0_18px_color-mix(in_srgb,var(--apm-switch-accent,var(--apm-radio-silence))_16%,transparent)]",
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
          "h-5 w-5 bg-[color-mix(in_srgb,var(--apm-faded-letter)_72%,transparent)] shadow-[0_3px_8px_rgba(0,0,0,.3)] transition-[transform,background] duration-[160ms] data-[state=checked]:translate-x-5 data-[state=checked]:bg-[var(--apm-switch-accent,var(--apm-radio-silence))]",
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
