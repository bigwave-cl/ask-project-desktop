import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const menuContentClass =
  "relative z-50 min-w-[188px] overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--apm-radio-silence)_34%,transparent)] bg-[linear-gradient(180deg,rgba(12,28,30,.94),rgba(5,8,13,.96)),repeating-linear-gradient(90deg,rgba(97,191,173,.055)_0_1px,transparent_1px_18px),repeating-linear-gradient(180deg,rgba(249,247,232,.04)_0_1px,transparent_1px_16px)] p-2 text-[var(--apm-text-main)] shadow-[0_18px_42px_rgba(0,0,0,.48),0_0_26px_color-mix(in_srgb,var(--apm-radio-silence)_18%,transparent),0_0_34px_color-mix(in_srgb,var(--apm-riviera)_8%,transparent),inset_0_1px_0_rgba(255,255,255,.1)] will-change-[transform,opacity] data-[state=open]:animate-[apm-menu-in_140ms_ease] data-[state=closed]:hidden data-[state=closed]:opacity-0 data-[state=closed]:pointer-events-none data-[side=top]:origin-bottom-right data-[side=right]:origin-left-top data-[side=bottom]:origin-top-right data-[side=left]:origin-right-top before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_16%_0%,color-mix(in_srgb,var(--apm-radio-silence)_24%,transparent),transparent_40%),radial-gradient(ellipse_at_92%_100%,color-mix(in_srgb,var(--apm-riviera)_16%,transparent),transparent_44%),linear-gradient(110deg,transparent_0_38%,rgba(249,247,232,.07)_46%,transparent_56%_100%)] before:opacity-[.78] before:mix-blend-screen after:pointer-events-none after:absolute after:left-3 after:right-3 after:top-0 after:h-px after:bg-[linear-gradient(90deg,transparent,var(--apm-radio-silence),var(--apm-riviera),transparent)] after:opacity-[.72] after:shadow-[0_0_14px_color-mix(in_srgb,var(--apm-radio-silence)_38%,transparent)]";

const menuItemClass =
  "group relative z-[1] my-0.5 grid min-h-[42px] w-full cursor-pointer select-none grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2 rounded-[7px] border border-transparent bg-transparent px-2.5 text-left text-[color-mix(in_srgb,var(--apm-swan-dive)_88%,transparent)] outline-none transition-[border-color,background,color,transform,box-shadow] duration-[160ms] before:absolute before:bottom-0 before:left-2 before:right-2 before:h-px before:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,currentColor_28%,transparent),transparent)] before:opacity-[.34] hover:translate-x-0.5 hover:border-[color-mix(in_srgb,currentColor_28%,transparent)] hover:bg-[linear-gradient(90deg,color-mix(in_srgb,currentColor_14%,transparent),transparent_76%),rgba(249,247,232,.035)] hover:text-[var(--apm-swan-dive)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_0_18px_color-mix(in_srgb,currentColor_12%,transparent)] data-[highlighted]:translate-x-0.5 data-[highlighted]:border-[color-mix(in_srgb,currentColor_28%,transparent)] data-[highlighted]:bg-[linear-gradient(90deg,color-mix(in_srgb,currentColor_14%,transparent),transparent_76%),rgba(249,247,232,.035)] data-[highlighted]:text-[var(--apm-swan-dive)] data-[highlighted]:shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_0_18px_color-mix(in_srgb,currentColor_12%,transparent)] [&_svg]:opacity-[.94] [&_svg]:[filter:drop-shadow(0_0_8px_currentColor)]";

const menuSeparatorClass =
  "relative z-[1] mx-2 my-[7px] h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--apm-radio-silence)_24%,transparent),color-mix(in_srgb,var(--apm-riviera)_18%,transparent),transparent)] opacity-[.82]";

const submenuBoxGapOffset = 15;

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  className,
  sideOffset = 8,
  align = "end",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(menuContentClass, className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(menuItemClass, className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(menuSeparatorClass, className)}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(menuItemClass, className)}
      {...props}
    />
  );
}

function DropdownMenuSubContent({
  className,
  sideOffset = submenuBoxGapOffset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        sideOffset={sideOffset}
        className={cn(menuContentClass, className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
};
