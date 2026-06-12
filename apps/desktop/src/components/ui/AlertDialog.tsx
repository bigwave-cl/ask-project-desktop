import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";

import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const alertDialogOverlayBaseClass =
  "pointer-events-none fixed inset-0 z-50 bg-black/80 opacity-0 transition-opacity duration-[160ms] data-[state=open]:pointer-events-auto data-[state=open]:opacity-100 data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0";

const alertDialogContentBaseClass =
  "pointer-events-none fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 scale-[.96] origin-center gap-4 border bg-background p-6 opacity-0 shadow-lg outline-none transition-[opacity,scale] duration-[180ms] ease-[cubic-bezier(.4,0,.2,1)] will-change-[opacity,scale] data-[state=open]:pointer-events-auto data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=open]:ease-[cubic-bezier(.16,1,.3,1)] data-[state=closed]:pointer-events-none data-[state=closed]:scale-[.96] data-[state=closed]:opacity-0 data-[state=closed]:duration-[160ms] sm:rounded-lg";

const alertDialogOverlayVariants = cva(alertDialogOverlayBaseClass, {
  variants: {
    variant: {
      default: "",
      project: "z-[70] bg-black/60 backdrop-blur-[7px]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertDialogContentVariants = cva(
  alertDialogContentBaseClass,
  {
    variants: {
      variant: {
        default: "",
        custom: "max-w-none gap-0 border-0 bg-transparent p-0 shadow-none sm:rounded-none",
        project:
          "z-[72] max-w-none gap-0 overflow-hidden rounded-[18px_8px_18px_8px] p-0 text-[var(--apm-text-main)] sm:rounded-[18px_8px_18px_8px]",
      },
      tone: {
        default: "",
        mint:
          "border border-apm-radio-34 bg-apm-dialog-mint shadow-apm-dialog-mint before:pointer-events-none before:absolute before:inset-0 before:bg-apm-dialog-sheen before:opacity-[.74] before:mix-blend-screen after:pointer-events-none after:absolute after:left-[18px] after:right-[18px] after:top-0 after:h-px after:bg-apm-line-mint-riviera after:opacity-[.72] after:shadow-apm-dialog-line",
        danger:
          "border border-apm-riviera-30 bg-apm-dialog-danger shadow-apm-dialog-danger",
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
  "relative grid h-[46px] w-[46px] flex-none place-items-center rounded-[15px_7px_15px_7px] border shadow-apm-dialog-sigil after:absolute after:inset-2 after:rounded-full after:border after:border-apm-riviera-22 after:opacity-[.66] [&_svg]:relative [&_svg]:z-[1]",
  {
    variants: {
      tone: {
        mint:
          "border-apm-radio-44 bg-apm-dialog-sigil-mint text-[var(--apm-radio-silence)]",
        danger:
          "border-apm-riviera-52 bg-apm-dialog-sigil-danger text-[var(--apm-riviera)] shadow-apm-dialog-sigil-danger",
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
  "relative z-[1] grid grid-cols-[1fr_42px_1fr] items-center gap-2.5 px-6 [&_span]:h-px [&_span]:bg-apm-line-riviera-soft [&_span]:shadow-apm-riviera-line [&_span:nth-child(2)]:bg-[color-mix(in_srgb,var(--apm-radio-silence)_50%,transparent)]";

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
  forceMount,
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
    <AlertDialogPortal forceMount={forceMount}>
      <AlertDialogOverlay
        forceMount={forceMount}
        variant={overlayVariant ?? (variant === "project" ? "project" : "default")}
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        forceMount={forceMount}
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
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  VariantProps<typeof buttonVariants>) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  VariantProps<typeof buttonVariants>) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant, size }), "mt-2 sm:mt-0", className)}
      {...props}
    />
  );
}

function ProjectAlertDialogVeil({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="alert-dialog-veil" className={cn(alertDialogVeilClass, className)} {...props}>
      <span className="left-[-72px] top-12 h-[42px] w-[220px] rotate-[-12deg] border border-apm-radio-30" />
      <span className="bottom-[34px] right-[-58px] h-[34px] w-[190px] rotate-[10deg] border border-apm-riviera-28" />
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
