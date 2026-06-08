"use client";

import { Radar } from "lucide-react";
import { toast as sonnerToast, type ExternalToast } from "sonner";

export type ProjectToastOptions = ExternalToast & {
  callback?: () => void;
  text?: string;
  timeout?: number;
};

type ProjectToastKind = "show" | "success" | "error" | "info" | "warning";

const DEFAULT_TIME = 2000;

const toastClassName = (kind: ProjectToastKind) => `apm-toast--${kind}`;

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

  const toastId = sonnerToast.custom(
    () => (
      <div className="apm-toast__content">
        <span className="apm-toast__sigil" aria-hidden="true">
          <Radar size={17} />
        </span>
        <span className="apm-toast__text">{text}</span>
        <button
          className="apm-toast__close"
          onClick={() => {
            sonnerToast.dismiss(toastId);
            normalized.callback?.();
          }}
        >
          关闭
        </button>
      </div>
    ),
    {
      ...normalized,
      className: toastClassName(kind),
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
