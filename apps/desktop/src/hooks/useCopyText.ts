"use client";

import Clipboard from "clipboard";

export type CopyTextOptions = {
  el?: string | Element;
  text: string;
};

const dialogContainerSelectors = [
  "[role='dialog']",
  "[role='alertdialog']",
  ".dialog",
  ".modal",
  "[data-radix-popper-content-wrapper]",
  "[data-slot='dropdown-menu-content']",
  "[data-slot='context-menu-content']",
].join(",");

function createTemporaryTrigger() {
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.style.position = "absolute";
  trigger.style.left = "-9999px";
  trigger.style.top = "-9999px";
  trigger.style.opacity = "0";
  trigger.style.pointerEvents = "none";
  document.body.appendChild(trigger);
  return trigger;
}

export function copyText(arg: string | CopyTextOptions): Promise<boolean> {
  if (typeof document === "undefined") {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const textToCopy = typeof arg === "string" ? arg : arg.text;
    let targetElement: string | Element | null = typeof arg === "string" ? null : arg.el || null;

    let isTemporary = false;
    if (!targetElement) {
      targetElement = createTemporaryTrigger();
      isTemporary = true;
    }

    const activeElement = document.activeElement;
    const dialogContainer =
      activeElement instanceof Element ? activeElement.closest(dialogContainerSelectors) : null;

    const clipboardOptions: Clipboard.Options = {
      text() {
        return textToCopy;
      },
    };

    if (dialogContainer) {
      clipboardOptions.container = dialogContainer;
    }

    const clipboard = new Clipboard(targetElement, clipboardOptions);

    const cleanup = () => {
      clipboard.destroy();
      if (isTemporary && targetElement instanceof Element && targetElement.parentNode) {
        targetElement.parentNode.removeChild(targetElement);
      }
    };

    clipboard.on("success", () => {
      cleanup();
      resolve(true);
    });

    clipboard.on("error", () => {
      cleanup();
      resolve(false);
    });

    try {
      if (targetElement instanceof Element) {
        targetElement.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      }
    } catch {
      cleanup();
      resolve(false);
    }
  });
}

export function useCopyText() {
  return copyText;
}
