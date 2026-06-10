import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";

import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const alertDialogOverlayVariants = cva("fixed inset-0 z-[70]", {
  variants: {
    variant: {
      default: "bg-black/60 backdrop-blur-[7px]",
      project: "bg-black/60 backdrop-blur-[7px]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertDialogContentVariants = cva(
  "fixed left-1/2 top-1/2 z-[71] -translate-x-1/2 -translate-y-1/2 outline-none",
  {
    variants: {
      variant: {
        default: "",
        project:
          "z-[72] overflow-hidden rounded-[18px_8px_18px_8px] text-[var(--apm-text-main)]",
      },
      tone: {
        default: "",
        mint:
          "border border-[color-mix(in_srgb,var(--apm-radio-silence)_34%,transparent)] bg-[linear-gradient(180deg,rgba(12,27,30,.92),rgba(5,9,16,.96)),repeating-linear-gradient(90deg,rgba(97,191,173,.06)_0_1px,transparent_1px_22px),repeating-linear-gradient(180deg,rgba(249,247,232,.04)_0_1px,transparent_1px_18px)] shadow-[0_28px_78px_rgba(0,0,0,.54),0_0_34px_color-mix(in_srgb,var(--apm-radio-silence)_18%,transparent),0_0_54px_color-mix(in_srgb,var(--apm-riviera)_10%,transparent),inset_0_1px_0_rgba(255,255,255,.1),inset_0_0_42px_rgba(97,191,173,.08)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_16%_0%,color-mix(in_srgb,var(--apm-radio-silence)_32%,transparent),transparent_36%),radial-gradient(ellipse_at_84%_100%,color-mix(in_srgb,var(--apm-riviera)_20%,transparent),transparent_42%),linear-gradient(110deg,transparent_0_38%,rgba(249,247,232,.07)_46%,transparent_56%_100%)] before:opacity-[.74] before:mix-blend-screen after:pointer-events-none after:absolute after:left-[18px] after:right-[18px] after:top-0 after:h-px after:bg-[linear-gradient(90deg,transparent,var(--apm-radio-silence),var(--apm-riviera),transparent)] after:opacity-[.72] after:shadow-[0_0_16px_color-mix(in_srgb,var(--apm-radio-silence)_44%,transparent)]",
        danger:
          "border border-[color-mix(in_srgb,var(--apm-riviera)_30%,transparent)] bg-[radial-gradient(circle_at_18%_0%,color-mix(in_srgb,var(--apm-riviera)_18%,transparent),transparent_38%),radial-gradient(circle_at_92%_100%,color-mix(in_srgb,var(--apm-radio-silence)_14%,transparent),transparent_42%),linear-gradient(180deg,rgba(16,16,22,.98),rgba(4,8,14,.98))] shadow-[0_26px_64px_rgba(0,0,0,.58),0_0_34px_color-mix(in_srgb,var(--apm-riviera)_16%,transparent),inset_0_1px_0_rgba(255,255,255,.1)]",
      },
      size: {
        auto: "",
        md: "w-[min(560px,calc(100vw-48px))]",
        lg: "w-[min(620px,calc(100vw-48px))]",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "default",
      size: "auto",
    },
  }
);

const alertDialogHeaderVariants = cva("", {
  variants: {
    variant: {
      default: "",
      project: "relative z-[1] flex items-center gap-3.5 px-6 pb-4 pt-[22px]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertDialogFooterVariants = cva("", {
  variants: {
    variant: {
      default: "",
      project: "relative z-[1] flex items-center justify-end gap-3 px-6 pb-[22px] pt-[18px]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertDialogDescriptionVariants = cva("", {
  variants: {
    variant: {
      default: "",
      projectConfirm:
        "relative z-[1] whitespace-pre-line px-6 pb-7 pt-2.5 text-[15px] font-semibold leading-[1.7] tracking-normal text-[color-mix(in_srgb,var(--apm-swan-dive)_82%,transparent)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertDialogSigilVariants = cva(
  "relative grid h-[46px] w-[46px] flex-none place-items-center rounded-[15px_7px_15px_7px] border shadow-[0_0_18px_color-mix(in_srgb,currentColor_18%,transparent),inset_0_0_20px_rgba(255,255,255,.08)] after:absolute after:inset-2 after:rounded-full after:border after:border-[color-mix(in_srgb,var(--apm-riviera)_22%,transparent)] after:opacity-[.66] [&_svg]:relative [&_svg]:z-[1]",
  {
    variants: {
      tone: {
        mint:
          "border-[color-mix(in_srgb,var(--apm-radio-silence)_44%,transparent)] bg-[radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--apm-radio-silence)_30%,transparent),transparent_64%),rgba(3,10,12,.72)] text-[var(--apm-radio-silence)]",
        danger:
          "border-[color-mix(in_srgb,var(--apm-riviera)_52%,transparent)] bg-[radial-gradient(circle_at_50%_50%,rgba(249,247,232,.18),transparent_22%),radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--apm-riviera)_36%,transparent),transparent_64%),rgba(22,9,14,.88)] text-[var(--apm-riviera)] shadow-[0_0_18px_color-mix(in_srgb,var(--apm-riviera)_24%,transparent),inset_0_0_20px_rgba(255,139,139,.14)]",
      },
    },
    defaultVariants: {
      tone: "mint",
    },
  }
);

const alertDialogHeadingClass =
  "min-w-0 [&_h2]:m-0 [&_h2]:text-2xl [&_h2]:leading-[1.2] [&_h2]:tracking-normal [&_span]:mb-1 [&_span]:block [&_span]:text-[11px] [&_span]:font-extrabold [&_span]:uppercase [&_span]:leading-[1.2] [&_span]:tracking-[.08em] [&_span]:text-[color-mix(in_srgb,var(--apm-riviera)_72%,transparent)]";

const alertDialogVeilClass =
  "pointer-events-none absolute inset-0 overflow-hidden [&_span]:absolute [&_span]:rounded-full [&_span]:opacity-[.68] [&_span]:[filter:blur(.2px)]";

const alertDialogDividerClass =
  "relative z-[1] grid grid-cols-[1fr_42px_1fr] items-center gap-2.5 px-6 [&_span]:h-px [&_span]:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--apm-riviera)_44%,transparent),transparent)] [&_span]:shadow-[0_0_12px_color-mix(in_srgb,var(--apm-riviera)_22%,transparent)] [&_span:nth-child(2)]:bg-[color-mix(in_srgb,var(--apm-radio-silence)_50%,transparent)]";

type ProjectAlertDialogHeaderProps = {
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: VariantProps<typeof alertDialogSigilVariants>["tone"];
};

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay> &
  VariantProps<typeof alertDialogOverlayVariants>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(alertDialogOverlayVariants({ variant, className }))}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  children,
  overlayVariant,
  size,
  tone,
  variant,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> &
  VariantProps<typeof alertDialogContentVariants> & {
    overlayVariant?: VariantProps<typeof alertDialogOverlayVariants>["variant"];
  }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay variant={overlayVariant ?? (variant === "project" ? "project" : "default")} />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(alertDialogContentVariants({ variant, tone, size, className }))}
        {...props}
      >
        {variant === "project" ? <ProjectAlertDialogVeil aria-hidden="true" /> : null}
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  eyebrow,
  heading,
  icon,
  tone,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof alertDialogHeaderVariants> &
  ProjectAlertDialogHeaderProps) {
  return (
    <div data-slot="alert-dialog-header" className={cn(alertDialogHeaderVariants({ variant, className }))} {...props}>
      {variant === "project" && (icon || eyebrow || heading) ? (
        <>
          <ProjectAlertDialogSigil tone={tone} aria-hidden="true">
            {icon}
          </ProjectAlertDialogSigil>
          <ProjectAlertDialogHeading>
            {eyebrow ? <span>{eyebrow}</span> : null}
            {heading ? <AlertDialogTitle>{heading}</AlertDialogTitle> : null}
          </ProjectAlertDialogHeading>
        </>
      ) : (
        children
      )}
    </div>
  );
}

function AlertDialogFooter({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertDialogFooterVariants>) {
  return (
    <>
      {variant === "project" ? <ProjectAlertDialogDivider aria-hidden="true" /> : null}
      <div data-slot="alert-dialog-footer" className={cn(alertDialogFooterVariants({ variant, className }))} {...props}>
        {children}
      </div>
    </>
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn(className)} {...props} />;
}

function AlertDialogDescription({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description> &
  VariantProps<typeof alertDialogDescriptionVariants>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(alertDialogDescriptionVariants({ variant, className }))}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  VariantProps<typeof buttonVariants>) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(variant || size ? buttonVariants({ variant, size }) : undefined, className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  VariantProps<typeof buttonVariants>) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(variant || size ? buttonVariants({ variant, size }) : undefined, className)}
      {...props}
    />
  );
}

function ProjectAlertDialogVeil({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="alert-dialog-veil" className={cn(alertDialogVeilClass, className)} {...props}>
      <span className="left-[-72px] top-12 h-[42px] w-[220px] rotate-[-12deg] border border-[color-mix(in_srgb,var(--apm-radio-silence)_30%,transparent)]" />
      <span className="bottom-[34px] right-[-58px] h-[34px] w-[190px] rotate-[10deg] border border-[color-mix(in_srgb,var(--apm-riviera)_28%,transparent)]" />
    </div>
  );
}

function ProjectAlertDialogSigil({
  className,
  tone,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertDialogSigilVariants>) {
  return <div data-slot="alert-dialog-sigil" className={cn(alertDialogSigilVariants({ tone, className }))} {...props} />;
}

function ProjectAlertDialogHeading({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-heading" className={cn(alertDialogHeadingClass, className)} {...props} />;
}

function ProjectAlertDialogDivider({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="alert-dialog-divider" className={cn(alertDialogDividerClass, className)} {...props}>
      <span />
      <span />
      <span />
    </div>
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
