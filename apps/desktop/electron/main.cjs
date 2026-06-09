/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, ipcMain, Menu, shell } = require("electron");
const path = require("node:path");
const { spawn } = require("node:child_process");

const defaultDevUrl = "http://localhost:4000";
const appUrl = process.env.ASK_PROJECT_ELECTRON_URL || defaultDevUrl;
const shouldOpenDevTools = process.env.ASK_PROJECT_ELECTRON_DEVTOOLS === "1";
const isSmokeTest = process.argv.includes("--smoke-test");

let mainWindow = null;
let smokeTimer = null;

app.setName("Ask Project");

const nativeBinaryName = process.platform === "win32" ? "ask-project-native.exe" : "ask-project-native";
const nativeBinaryPath = path.join(__dirname, "..", "native", "target", "debug", nativeBinaryName);

const runNativeCommand = (command, args = {}) =>
  new Promise((resolve, reject) => {
    if (!command) {
      reject(new Error("缺少 Rust native command"));
      return;
    }

    const child = spawn(nativeBinaryPath, [command], {
      cwd: path.join(__dirname, ".."),
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      reject(new Error(`Rust 原生能力启动失败，请先运行 pnpm --filter desktop native:build。\n${error.message}`));
    });

    child.on("close", (code) => {
      try {
        const payload = JSON.parse(stdout);
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
        reject(new Error(`Rust 原生能力返回格式异常：${error.message}`));
      }
    });

    child.stdin.end(JSON.stringify({
      storeDir: app.getPath("userData"),
      args,
    }));
  });

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 720,
    title: "Ask Project",
    backgroundColor: "#030710",
    show: false,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 14, y: 14 },
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
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
    if (isSmokeTest) {
      mainWindow.webContents
        .executeJavaScript("window.askProjectDesktop.invoke('get_preferences')")
        .then(() => {
          console.log("[electron] Rust native IPC smoke 通过");
          smokeTimer = setTimeout(() => app.quit(), 300);
        })
        .catch((error) => {
          console.error(`[electron] Rust native IPC smoke 失败: ${error.message}`);
          app.exit(1);
        });
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadURL(appUrl);
};

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  ipcMain.handle("ask-project:native", (_event, payload) => runNativeCommand(payload?.command, payload?.args));
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
