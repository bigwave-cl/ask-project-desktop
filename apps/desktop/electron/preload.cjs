/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("askProjectDesktop", {
  runtime: "electron",
  webview: "chromium",
  invoke: (command, args) => ipcRenderer.invoke("ask-project:native", { command, args }),
});
