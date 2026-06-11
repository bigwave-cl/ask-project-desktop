import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const dialogOverlayBaseClass =
  "apm-dialog-overlay fixed inset-0 z-50 bg-black/80";

const dialogContentBaseClass =
  "apm-dialog-content fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg outline-none sm:rounded-lg";

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

const dialogHeadingClass =
  "min-w-0 [&_h2]:m-0 [&_h2]:text-2xl [&_h2]:leading-[1.2] [&_h2]:tracking-normal [&_span]:mb-1 [&_span]:block [&_span]:text-[11px] [&_span]:font-extrabold [&_span]:uppercase [&_span]:leading-[1.2] [&_span]:tracking-[.08em] [&_span]:text-[color-mix(in_srgb,var(--apm-riviera)_72%,transparent)]";

const dialogVeilClass =
  "pointer-events-none absolute inset-0 overflow-hidden [&_span]:absolute [&_span]:rounded-full [&_span]:opacity-[.68] [&_span]:[filter:blur(.2px)]";

const dialogDividerClass =
  "relative z-[1] grid grid-cols-[1fr_42px_1fr] items-center gap-2.5 px-6 [&_span]:h-px [&_span]:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--apm-riviera)_44%,transparent),transparent)] [&_span]:shadow-[0_0_12px_color-mix(in_srgb,var(--apm-riviera)_22%,transparent)] [&_span:nth-child(2)]:bg-[color-mix(in_srgb,var(--apm-radio-silence)_50%,transparent)]";

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
      <span className="left-[-72px] top-12 h-[42px] w-[220px] rotate-[-12deg] border border-[color-mix(in_srgb,var(--apm-radio-silence)_30%,transparent)]" />
      <span className="bottom-[34px] right-[-58px] h-[34px] w-[190px] rotate-[10deg] border border-[color-mix(in_srgb,var(--apm-riviera)_28%,transparent)]" />
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
