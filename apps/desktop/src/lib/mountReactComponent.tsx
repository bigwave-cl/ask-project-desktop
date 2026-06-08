import { type ReactNode } from "react";
import { createRoot } from "react-dom/client";

type MountReactComponentOptions = {
  containerEl?: string | HTMLElement;
  onMounted?: () => void;
  onUnmounted?: () => void;
};

export function mountReactComponent(node: ReactNode, options: MountReactComponentOptions = {}) {
  if (typeof document === "undefined") {
    return {
      container: null,
      update: () => undefined,
      unmount: () => undefined,
    };
  }

  const container = document.createElement("div");
  const target =
    typeof options.containerEl === "string"
      ? document.querySelector(options.containerEl) || document.body
      : options.containerEl || document.body;
  const root = createRoot(container);

  target.appendChild(container);
  root.render(node);
  options.onMounted?.();

  return {
    container,
    update: (nextNode: ReactNode) => {
      root.render(nextNode);
    },
    unmount: () => {
      options.onUnmounted?.();
      root.unmount();
      container.remove();
    },
  };
}
