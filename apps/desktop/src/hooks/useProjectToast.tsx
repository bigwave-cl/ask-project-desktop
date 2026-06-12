"use client";

import { Radar } from "lucide-react";
import { toast as sonnerToast, type ExternalToast } from "sonner";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ProjectToastOptions = ExternalToast & {
  callback?: () => void;
  text?: string;
  timeout?: number;
};

type ProjectToastKind = "show" | "success" | "error" | "info" | "warning";

const DEFAULT_TIME = 2000;

const projectToastRootClass =
  "relative w-[min(460px,calc(100vw-32px))] min-w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-lg border border-transparent [background:linear-gradient(180deg,rgb(13,30,32),rgb(4,8,14))_padding-box,repeating-linear-gradient(90deg,rgba(97,191,173,.045)_0_1px,transparent_1px_18px)_padding-box,linear-gradient(100deg,color-mix(in_srgb,var(--apm-radio-silence)_76%,transparent),color-mix(in_srgb,var(--apm-riviera)_62%,transparent)_66%,color-mix(in_srgb,var(--apm-radio-silence)_48%,transparent))_border-box] p-0 text-[var(--apm-text-main)] shadow-[0_18px_46px_rgba(0,0,0,.42),0_0_24px_color-mix(in_srgb,var(--apm-radio-silence)_18%,transparent),inset_0_1px_0_rgba(255,255,255,.1)]";

const projectToastToneClass: Record<ProjectToastKind, string> = {
  show: "",
  success: "",
  info: "",
  error: "border-apm-riviera-38",
  warning: "border-apm-mauve-38",
};

const showProjectToast = (
  kind: ProjectToastKind,
  messageOrOptions: string | ProjectToastOptions,
  options?: ProjectToastOptions
) => {
  const normalized =
    typeof messageOrOptions === "string"
      ? { ...(options || {}), text: messageOrOptions }
      : messageOrOptions;
  const text = normalized.text || "";
  const duration = normalized.timeout ?? normalized.duration ?? DEFAULT_TIME;
  const externalOptions = { ...normalized };
  delete externalOptions.callback;
  delete externalOptions.text;
  delete externalOptions.timeout;
  delete externalOptions.className;

  const toastId = sonnerToast.custom(
    () => (
      <div className="relative z-[1] grid min-h-[54px] w-full grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2.5 px-2 py-2.5 pl-3.5">
        <span
          className="relative grid h-[30px] w-[30px] flex-none place-items-center rounded-[8px_4px] border border-apm-radio-48 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--apm-radio-silence)_34%,transparent),transparent_64%),rgba(4,16,18,.82)] text-[var(--apm-radio-silence)] shadow-[inset_0_0_14px_rgba(97,191,173,.14)] after:absolute after:inset-[7px] after:rounded-full after:border after:border-apm-riviera-26 after:content-[''] [&_svg]:relative [&_svg]:z-[1]"
          aria-hidden="true"
        >
          <Radar size={17} />
        </span>
        <span className="min-w-0 text-sm font-semibold leading-[1.35] tracking-normal text-[var(--apm-text-main)] [text-wrap:pretty]">
          {text}
        </span>
        <Button
          className="h-[34px] min-h-[34px] min-w-[54px] rounded-lg border-0 bg-transparent px-2 py-1 font-bold text-[color-mix(in_srgb,var(--apm-swan-dive)_76%,transparent)] shadow-none hover:bg-transparent hover:text-[var(--apm-swan-dive)] active:bg-transparent focus-visible:border-transparent focus-visible:ring-0"
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => {
            sonnerToast.dismiss(toastId);
            normalized.callback?.();
          }}
        >
          关闭
        </Button>
      </div>
    ),
    {
      ...externalOptions,
      className: cn(projectToastRootClass, projectToastToneClass[kind], normalized.className),
      duration,
      onDismiss: (toast) => {
        normalized.onDismiss?.(toast);
      },
    }
  );

  return toastId;
};

export const projectToast = {
  show: (messageOrOptions: string | ProjectToastOptions, options?: ProjectToastOptions) =>
    showProjectToast("show", messageOrOptions, options),
  success: (message: string, options?: ProjectToastOptions) => showProjectToast("success", message, options),
  error: (message: string, options?: ProjectToastOptions) => showProjectToast("error", message, options),
  info: (message: string, options?: ProjectToastOptions) => showProjectToast("info", message, options),
  warning: (message: string, options?: ProjectToastOptions) => showProjectToast("warning", message, options),
};

export function useProjectToast() {
  return projectToast;
}
