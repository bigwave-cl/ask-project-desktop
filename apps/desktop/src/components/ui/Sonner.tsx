"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { cn } from "@/lib/utils";

const toasterVariants = cva("", {
  variants: {
    variant: {
      default: "",
      project: "[--width:min(460px,calc(100vw-32px))]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ProjectToasterProps = ToasterProps & VariantProps<typeof toasterVariants>;

export function Toaster({
  className,
  style,
  toastOptions,
  variant,
  ...props
}: ProjectToasterProps) {
  return (
    <Sonner
      className={cn(toasterVariants({ variant }), className)}
      duration={2000}
      gap={10}
      position="top-right"
      style={style}
      theme="dark"
      toastOptions={toastOptions}
      {...props}
    />
  );
}
