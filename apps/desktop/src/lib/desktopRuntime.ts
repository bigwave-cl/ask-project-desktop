type DesktopRuntimeBridge = {
  runtime: "electron";
  webview: "chromium";
  invoke: <T>(command: string, args?: Record<string, unknown>) => Promise<T>;
};

declare global {
  interface Window {
    askProjectDesktop?: DesktopRuntimeBridge;
  }
}

export const isElectronRuntime = () =>
  typeof window !== "undefined" && window.askProjectDesktop?.runtime === "electron";

export const isDesktopRuntime = () => isElectronRuntime();

export const invokeDesktop = async <T,>(command: string, args?: Record<string, unknown>) => {
  if (isElectronRuntime()) {
    return window.askProjectDesktop!.invoke<T>(command, args);
  }
  throw new Error("当前环境不是桌面运行时");
};

export {};
