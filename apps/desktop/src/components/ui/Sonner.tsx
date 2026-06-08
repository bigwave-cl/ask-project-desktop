"use client";

import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="apm-sonner"
      duration={2000}
      gap={10}
      position="top-right"
      style={{ "--width": "min(460px, calc(100vw - 32px))" } as CSSProperties}
      theme="dark"
      toastOptions={{
        className: "apm-toast",
      }}
      {...props}
    />
  );
}
