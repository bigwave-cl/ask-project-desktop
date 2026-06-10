"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { mountReactComponent } from "@/lib/mountReactComponent";

export type ProjectInfoDialogOptions = {
  title: string;
  nameLabel: string;
  name?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  multiline?: boolean;
  required?: boolean;
};

type ProjectInfoDialogState = Required<
  Pick<ProjectInfoDialogOptions, "title" | "nameLabel" | "confirmText" | "cancelText" | "multiline" | "required">
> &
  Pick<ProjectInfoDialogOptions, "placeholder"> & {
    name: string;
    open: boolean;
  };

type ProjectInfoDialogProps = {
  onCancel: () => void;
  onConfirm: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  state: ProjectInfoDialogState;
};

const defaultInfoState: ProjectInfoDialogState = {
  open: false,
  title: "",
  nameLabel: "",
  name: "",
  placeholder: "",
  confirmText: "确认",
  cancelText: "关闭",
  multiline: false,
  required: true,
};

let activeInfoDialog: { resolve: (value: string | null) => void; unmount: () => void } | null = null;

const unmountAfterClose = (unmount: () => void) => {
  window.setTimeout(() => {
    unmount();
  }, 180);
};

export function projectInfoDialog(options: ProjectInfoDialogOptions) {
  if (typeof document === "undefined") {
    return Promise.resolve(null);
  }

  activeInfoDialog?.resolve(null);
  activeInfoDialog?.unmount();

  const state: ProjectInfoDialogState = {
    open: true,
    title: options.title,
    nameLabel: options.nameLabel,
    name: options.name || "",
    placeholder: options.placeholder || "",
    confirmText: options.confirmText || defaultInfoState.confirmText,
    cancelText: options.cancelText || defaultInfoState.cancelText,
    multiline: options.multiline ?? defaultInfoState.multiline,
    required: options.required ?? defaultInfoState.required,
  };

  return new Promise<string | null>((resolve) => {
    let finished = false;
    const mounted = mountReactComponent(null);
    if (mounted.container) {
      mounted.container.dataset.apmInfoContainer = "true";
    }

    const finish = (value: string | null) => {
      if (finished) return;
      finished = true;
      if (activeInfoDialog?.resolve === resolve) {
        activeInfoDialog = null;
      }
      resolve(value);
      mounted.update(
        <ProjectInfoDialog
          state={{ ...state, open: false }}
          onOpenChange={() => undefined}
          onCancel={() => undefined}
          onConfirm={() => undefined}
        />
      );
      unmountAfterClose(mounted.unmount);
    };

    activeInfoDialog = {
      resolve,
      unmount: mounted.unmount,
    };

    mounted.update(
      <ProjectInfoDialog
        state={state}
        onOpenChange={(open) => {
          if (!open) finish(null);
        }}
        onCancel={() => finish(null)}
        onConfirm={(value) => finish(value)}
      />
    );
  });
}

export function useProjectInfoDialog() {
  return projectInfoDialog;
}

function ProjectInfoDialog({
  state,
  onOpenChange,
  onCancel,
  onConfirm,
}: ProjectInfoDialogProps) {
  const [value, setValue] = useState(state.name);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const trimmedValue = value.trim();
  const isConfirmDisabled = state.required && trimmedValue.length === 0;

  useEffect(() => {
    if (!state.open) return;
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 40);
    return () => window.clearTimeout(timer);
  }, [state.open]);

  const confirm = () => {
    if (isConfirmDisabled) return;
    onConfirm(trimmedValue);
  };

  return (
    <Dialog open={state.open} onOpenChange={onOpenChange}>
      <DialogContent variant="project" tone="mint" size="lg">
        <DialogHeader
          variant="project"
          tone="mint"
          icon={<Sparkles size={22} />}
          eyebrow="Ling Shu Node"
          heading={state.title}
        />

        <DialogDescription variant="srOnly">
          {state.nameLabel}
        </DialogDescription>

        <div className="relative z-[1] px-6 pb-7 pt-3.5">
          <label className="grid gap-2 [&>span]:text-[13px] [&>span]:font-bold [&>span]:tracking-normal [&>span]:text-[var(--apm-text-muted)]">
            <span>{state.nameLabel}</span>
            {state.multiline ? (
              <Textarea
                variant="project"
                id={inputId}
                name="project-info-dialog-value"
                ref={inputRef as React.Ref<HTMLTextAreaElement>}
                value={value}
                placeholder={state.placeholder}
                rows={6}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                    event.preventDefault();
                    confirm();
                  }
                }}
              />
            ) : (
              <Input
                variant="project"
                id={inputId}
                name="project-info-dialog-value"
                ref={inputRef as React.Ref<HTMLInputElement>}
                value={value}
                placeholder={state.placeholder}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    confirm();
                  }
                }}
              />
            )}
          </label>
        </div>

        <DialogFooter variant="project">
          <Button
            type="button"
            variant="projectGhost"
            size="project"
            onClick={onCancel}
          >
            {state.cancelText}
          </Button>
          <Button
            disabled={isConfirmDisabled}
            type="button"
            variant="projectPrimary"
            size="project"
            onClick={confirm}
          >
            {state.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
