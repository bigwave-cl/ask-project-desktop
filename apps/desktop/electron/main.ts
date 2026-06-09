import { spawn } from "node:child_process";
import path from "node:path";

import { app, BrowserWindow, ipcMain, Menu, shell } from "electron";

type NativePayload = {
  command?: string;
  args?: Record<string, unknown>;
};

type NativeResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error?: string;
    };

const defaultDevUrl = "http://localhost:4000";
const appUrl = process.env.ASK_PROJECT_ELECTRON_URL || defaultDevUrl;
const shouldOpenDevTools = process.env.ASK_PROJECT_ELECTRON_DEVTOOLS === "1";
const isSmokeTest = process.argv.includes("--smoke-test");

let mainWindow: BrowserWindow | null = null;
let smokeTimer: ReturnType<typeof setTimeout> | null = null;

app.setName("Ask Project");

const nativeBinaryName = process.platform === "win32" ? "ask-project-native.exe" : "ask-project-native";
const nativeBinaryPath = path.join(__dirname, "..", "..", "native", "target", "debug", nativeBinaryName);
const desktopCwd = path.join(__dirname, "..", "..");
const windowIconPath = path.join(
  __dirname,
  "..",
  "assets",
  "icons",
  process.platform === "win32" ? "icon.ico" : "icon.png",
);

const runNativeCommand = <T>(command?: string, args: Record<string, unknown> = {}) =>
  new Promise<T>((resolve, reject) => {
    if (!command) {
      reject(new Error("缺少 Rust native command"));
      return;
    }

    const child = spawn(nativeBinaryPath, [command], {
      cwd: desktopCwd,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      reject(new Error(`Rust 原生能力启动失败，请先运行 pnpm --filter desktop native:build。\n${error.message}`));
    });

    child.on("close", (code) => {
      try {
        const payload = JSON.parse(stdout) as NativeResult<T>;
        if (payload.ok) {
          resolve(payload.data);
          return;
        }
        reject(new Error(payload.error || "Rust 原生能力返回了未知错误"));
      } catch (error) {
        if (code !== 0) {
          reject(new Error(stderr || `Rust 原生能力执行失败，退出码：${code}`));
          return;
        }
        const message = error instanceof Error ? error.message : String(error);
        reject(new Error(`Rust 原生能力返回格式异常：${message}`));
      }
    });

    child.stdin.end(
      JSON.stringify({
        storeDir: app.getPath("userData"),
        args,
      }),
    );
  });

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 720,
    title: "Ask Project",
    icon: windowIconPath,
    backgroundColor: "#030710",
    show: false,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 14, y: 14 },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      backgroundThrottling: false,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    if (shouldOpenDevTools) {
      mainWindow?.webContents.openDevTools({ mode: "detach" });
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedUrl) => {
    console.error(`[electron] 页面加载失败: ${validatedUrl}`);
    console.error(`[electron] ${errorCode}: ${errorDescription}`);
    if (isSmokeTest) {
      app.exit(1);
    }
  });

  mainWindow.webContents.once("did-finish-load", () => {
    console.log(`[electron] 已加载: ${appUrl}`);
    if (!isSmokeTest) {
      return;
    }

    mainWindow
      ?.webContents.executeJavaScript("window.askProjectDesktop.invoke('get_preferences')")
      .then(() => {
        console.log("[electron] Rust native IPC smoke 通过");
        smokeTimer = setTimeout(() => app.quit(), 300);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[electron] Rust native IPC smoke 失败: ${message}`);
        app.exit(1);
      });
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadURL(appUrl);
};

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  ipcMain.handle("ask-project:native", (_event, payload: NativePayload) =>
    runNativeCommand(payload?.command, payload?.args),
  );
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (smokeTimer) {
    clearTimeout(smokeTimer);
    smokeTimer = null;
  }

  if (process.platform !== "darwin" || isSmokeTest) {
    app.quit();
  }
});
