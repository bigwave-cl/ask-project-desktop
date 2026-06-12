import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const dialogOverlayBaseClass =
  "pointer-events-none fixed inset-0 z-50 bg-black/80 opacity-0 transition-opacity duration-[160ms] data-[state=open]:pointer-events-auto data-[state=open]:opacity-100 data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0";

const dialogContentBaseClass =
  "pointer-events-none fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 scale-[.96] origin-center gap-4 border bg-background p-6 opacity-0 shadow-lg outline-none transition-[opacity,scale] duration-[180ms] ease-[cubic-bezier(.4,0,.2,1)] will-change-[opacity,scale] data-[state=open]:pointer-events-auto data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=open]:ease-[cubic-bezier(.16,1,.3,1)] data-[state=closed]:pointer-events-none data-[state=closed]:scale-[.96] data-[state=closed]:opacity-0 data-[state=closed]:duration-[160ms] sm:rounded-lg";

const dialogOverlayVariants = cva(dialogOverlayBaseClass, {
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

const dialogContentVariants = cva(
  dialogContentBaseClass,
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

const dialogHeaderVariants = cva("", {
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

const dialogFooterVariants = cva("", {
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

const dialogDescriptionVariants = cva("", {
  variants: {
    variant: {
      default: "",
      srOnly: "absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0_0_0_0)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const dialogSigilVariants = cva(
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

const dialogHeadingClass =
  "min-w-0 [&_h2]:m-0 [&_h2]:text-2xl [&_h2]:leading-[1.2] [&_h2]:tracking-normal [&_span]:mb-1 [&_span]:block [&_span]:text-[11px] [&_span]:font-extrabold [&_span]:uppercase [&_span]:leading-[1.2] [&_span]:tracking-[.08em] [&_span]:text-[color-mix(in_srgb,var(--apm-riviera)_72%,transparent)]";

const dialogVeilClass =
  "pointer-events-none absolute inset-0 overflow-hidden [&_span]:absolute [&_span]:rounded-full [&_span]:opacity-[.68] [&_span]:[filter:blur(.2px)]";

const dialogDividerClass =
  "relative z-[1] grid grid-cols-[1fr_42px_1fr] items-center gap-2.5 px-6 [&_span]:h-px [&_span]:bg-apm-line-riviera-soft [&_span]:shadow-apm-riviera-line [&_span:nth-child(2)]:bg-[color-mix(in_srgb,var(--apm-radio-silence)_50%,transparent)]";

type ProjectDialogHeaderProps = {
  eyebrow?: React.ReactNode;
  heading?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: VariantProps<typeof dialogSigilVariants>["tone"];
};

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogOverlay({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay> &
  VariantProps<typeof dialogOverlayVariants>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(dialogOverlayVariants({ variant, className }))}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  forceMount,
  overlayVariant,
  size,
  tone,
  variant,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants> & {
    overlayVariant?: VariantProps<typeof dialogOverlayVariants>["variant"];
  }) {
  return (
    <DialogPortal forceMount={forceMount}>
      <DialogOverlay
        forceMount={forceMount}
        variant={overlayVariant ?? (variant === "project" ? "project" : "default")}
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        forceMount={forceMount}
        className={cn(dialogContentVariants({ variant, tone, size, className }))}
        {...props}
      >
        {variant === "project" ? <ProjectDialogVeil aria-hidden="true" /> : null}
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  eyebrow,
  heading,
  icon,
  tone,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof dialogHeaderVariants> &
  ProjectDialogHeaderProps) {
  return (
    <div data-slot="dialog-header" className={cn(dialogHeaderVariants({ variant, className }))} {...props}>
      {variant === "project" && (icon || eyebrow || heading) ? (
        <>
          <ProjectDialogSigil tone={tone} aria-hidden="true">
            {icon}
          </ProjectDialogSigil>
          <ProjectDialogHeading>
            {eyebrow ? <span>{eyebrow}</span> : null}
            {heading ? <DialogTitle>{heading}</DialogTitle> : null}
          </ProjectDialogHeading>
        </>
      ) : (
        children
      )}
    </div>
  );
}

function DialogFooter({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof dialogFooterVariants>) {
  return (
    <>
      {variant === "project" ? <ProjectDialogDivider aria-hidden="true" /> : null}
      <div data-slot="dialog-footer" className={cn(dialogFooterVariants({ variant, className }))} {...props}>
        {children}
      </div>
    </>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn(className)} {...props} />;
}

function DialogDescription({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description> &
  VariantProps<typeof dialogDescriptionVariants>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(dialogDescriptionVariants({ variant, className }))}
      {...props}
    />
  );
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function ProjectDialogVeil({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-veil" className={cn(dialogVeilClass, className)} {...props}>
      <span className="left-[-72px] top-12 h-[42px] w-[220px] rotate-[-12deg] border border-apm-radio-30" />
      <span className="bottom-[34px] right-[-58px] h-[34px] w-[190px] rotate-[10deg] border border-apm-riviera-28" />
    </div>
  );
}

function ProjectDialogSigil({
  className,
  tone,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof dialogSigilVariants>) {
  return <div data-slot="dialog-sigil" className={cn(dialogSigilVariants({ tone, className }))} {...props} />;
}

function ProjectDialogHeading({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-heading" className={cn(dialogHeadingClass, className)} {...props} />;
}

function ProjectDialogDivider({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="dialog-divider" className={cn(dialogDividerClass, className)} {...props}>
      <span />
      <span />
      <span />
    </div>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
