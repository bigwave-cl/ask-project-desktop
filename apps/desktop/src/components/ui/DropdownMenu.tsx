import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const menuContentClass =
  "relative z-50 min-w-[188px] overflow-hidden rounded-2xl border border-apm-radio-34 bg-apm-menu-content p-2 text-[var(--apm-text-main)] shadow-apm-menu-content will-change-[transform,opacity] data-[state=open]:animate-[apm-menu-in_140ms_ease] data-[state=closed]:hidden data-[state=closed]:opacity-0 data-[state=closed]:pointer-events-none data-[side=top]:origin-bottom-right data-[side=right]:origin-left-top data-[side=bottom]:origin-top-right data-[side=left]:origin-right-top before:pointer-events-none before:absolute before:inset-0 before:bg-apm-menu-sheen before:opacity-[.78] before:mix-blend-screen after:pointer-events-none after:absolute after:left-3 after:right-3 after:top-0 after:h-px after:bg-apm-line-mint-riviera after:opacity-[.72] after:shadow-apm-menu-line";

const menuItemClass =
  "group relative z-[1] my-0.5 grid min-h-[42px] w-full cursor-pointer select-none grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2 rounded-[7px] border border-transparent bg-transparent px-2.5 text-left text-[color-mix(in_srgb,var(--apm-swan-dive)_88%,transparent)] outline-none transition-[border-color,background,color,transform,box-shadow] duration-[160ms] before:absolute before:bottom-0 before:left-2 before:right-2 before:h-px before:bg-apm-line-current-soft before:opacity-[.34] hover:translate-x-0.5 hover:border-apm-current-28 hover:bg-apm-menu-item-active hover:text-[var(--apm-swan-dive)] hover:shadow-apm-menu-item-active data-[highlighted]:translate-x-0.5 data-[highlighted]:border-apm-current-28 data-[highlighted]:bg-apm-menu-item-active data-[highlighted]:text-[var(--apm-swan-dive)] data-[highlighted]:shadow-apm-menu-item-active [&_svg]:opacity-[.94] [&_svg]:[filter:drop-shadow(0_0_8px_currentColor)]";

const menuSeparatorClass =
  "relative z-[1] mx-2 my-[7px] h-px bg-apm-line-menu-divider opacity-[.82]";

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
