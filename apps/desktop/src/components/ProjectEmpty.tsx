"use client";

import { FileStack } from "lucide-react";
import { type ReactNode } from "react";

type ProjectEmptyProps = {
  children?: ReactNode;
  text?: ReactNode;
};

export function ProjectEmpty({ children, text = "还没有数据、添加一个吧" }: ProjectEmptyProps) {
  return (
    <div className="block h-full min-h-[220px] w-full">
      <div className="relative isolate flex h-full min-h-[inherit] w-full flex-col items-center justify-center text-[color-mix(in_srgb,var(--apm-faded-letter)_72%,transparent)] before:absolute before:left-1/2 before:top-[46%] before:z-[-1] before:h-[180px] before:w-[min(520px,70%)] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[radial-gradient(ellipse_at_50%_42%,color-mix(in_srgb,var(--apm-radio-silence)_16%,transparent),transparent_58%),radial-gradient(ellipse_at_50%_64%,color-mix(in_srgb,var(--apm-riviera)_10%,transparent),transparent_62%)] before:opacity-[.72] before:blur-[12px]">
        <div
          className="relative grid min-h-[58px] w-auto place-items-center text-[color-mix(in_srgb,var(--apm-swan-dive)_70%,transparent)] opacity-[.82] [&_svg]:relative [&_svg]:z-[1] [&_svg]:[filter:drop-shadow(0_0_12px_color-mix(in_srgb,var(--apm-radio-silence)_28%,transparent))_drop-shadow(0_0_22px_color-mix(in_srgb,var(--apm-riviera)_14%,transparent))]"
          aria-hidden="true"
        >
          <FileStack size={62} strokeWidth={1.6} />
        </div>
        <div className="max-w-[min(520px,82%)] break-all py-[18px_24px] text-center text-sm leading-[1.7] [text-shadow:0_0_16px_color-mix(in_srgb,var(--apm-radio-silence)_16%,transparent)]">
          {text}
        </div>
        {children}
      </div>
    </div>
  );
}
