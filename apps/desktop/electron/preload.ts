import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("askProjectDesktop", {
  runtime: "electron",
  webview: "chromium",
  invoke: (command: string, args?: Record<string, unknown>) =>
    ipcRenderer.invoke("ask-project:native", { command, args }),
});
