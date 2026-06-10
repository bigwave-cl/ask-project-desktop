"use client";

import { AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/AlertDialog";
import { mountReactComponent } from "@/lib/mountReactComponent";

export type ProjectConfirmOptions = {
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
};

type ProjectConfirmState = Required<Omit<ProjectConfirmOptions, "danger">> & {
  danger: boolean;
  open: boolean;
};

type ProjectConfirmDialogProps = {
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  state: ProjectConfirmState;
};

const defaultConfirmState: ProjectConfirmState = {
  open: false,
  title: "",
  content: "",
  confirmText: "确认删除",
  cancelText: "取消",
  danger: true,
};

let activeConfirm: { resolve: (value: boolean) => void; unmount: () => void } | null = null;

const unmountAfterClose = (unmount: () => void) => {
  window.setTimeout(() => {
    unmount();
  }, 180);
};

export function projectConfirm(options: ProjectConfirmOptions) {
  if (typeof document === "undefined") {
    return Promise.resolve(false);
  }

  activeConfirm?.resolve(false);
  activeConfirm?.unmount();

  const state: ProjectConfirmState = {
    open: true,
    title: options.title,
    content: options.content,
    confirmText: options.confirmText || defaultConfirmState.confirmText,
    cancelText: options.cancelText || defaultConfirmState.cancelText,
    danger: options.danger ?? true,
  };

  return new Promise<boolean>((resolve) => {
    let finished = false;
    const mounted = mountReactComponent(null);
    if (mounted.container) {
      mounted.container.dataset.apmConfirmContainer = "true";
    }

    const finish = (value: boolean) => {
      if (finished) return;
      finished = true;
      if (activeConfirm?.resolve === resolve) {
        activeConfirm = null;
      }
      resolve(value);
      mounted.update(
        <ProjectConfirmDialog
          state={{ ...state, open: false }}
          onOpenChange={() => undefined}
          onCancel={() => undefined}
          onConfirm={() => undefined}
        />
      );
      unmountAfterClose(mounted.unmount);
    };

    activeConfirm = {
      resolve,
      unmount: mounted.unmount,
    };

    mounted.update(
      <ProjectConfirmDialog
        state={state}
        onOpenChange={(open) => {
          if (!open) finish(false);
        }}
        onCancel={() => finish(false)}
        onConfirm={() => finish(true)}
      />
    );
  });
}

export function useProjectConfirm() {
  return projectConfirm;
}

function ProjectConfirmDialog({
  state,
  onOpenChange,
  onCancel,
  onConfirm,
}: ProjectConfirmDialogProps) {
  return (
    <AlertDialog open={state.open} onOpenChange={onOpenChange}>
      <AlertDialogContent variant="project" tone="danger" size="md">
        <AlertDialogHeader
          variant="project"
          tone="danger"
          icon={<AlertTriangle size={22} />}
          eyebrow="Ling Shu Guard"
          heading={state.title}
        />

        <AlertDialogDescription variant="projectConfirm">
          {state.content}
        </AlertDialogDescription>

        <AlertDialogFooter variant="project">
          <AlertDialogCancel
            variant="projectGhost"
            size="project"
            onClick={onCancel}
          >
            {state.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={state.danger ? "projectDanger" : "projectPrimary"}
            size="project"
            onClick={onConfirm}
          >
            {state.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
