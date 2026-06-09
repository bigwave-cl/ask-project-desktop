import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { app, BrowserWindow, ipcMain, Menu, nativeImage, net, protocol, shell } from "electron";

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

type DesktopPackageConfig = {
  name?: string;
  productName?: string;
  version?: string;
};

const defaultDevUrl = "http://localhost:4000";
const appScheme = "ask-project";
const devAppUrl = process.env.ASK_PROJECT_ELECTRON_URL || defaultDevUrl;
const packagedAppUrl = `${appScheme}://app/index.html`;
const appUrl = app.isPackaged ? packagedAppUrl : devAppUrl;
const shouldOpenDevTools = process.env.ASK_PROJECT_ELECTRON_DEVTOOLS === "1";
const isSmokeTest = process.argv.includes("--smoke-test");

let mainWindow: BrowserWindow | null = null;
let smokeTimer: ReturnType<typeof setTimeout> | null = null;

protocol.registerSchemesAsPrivileged([
  {
    scheme: appScheme,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

const nativeBinaryName = process.platform === "win32" ? "ask-project-native.exe" : "ask-project-native";
const distRoot = path.join(__dirname, "..");
const desktopRoot = path.join(distRoot, "..");
const desktopPackagePath = path.join(desktopRoot, "package.json");
const nativeBinaryPath = app.isPackaged
  ? path.join(process.resourcesPath, "native", nativeBinaryName)
  : path.join(distRoot, "dist-rust", "debug", nativeBinaryName);
const desktopCwd = app.isPackaged ? process.resourcesPath : desktopRoot;
const windowIconPath = path.join(
  __dirname,
  "..",
  "..",
  "electron",
  "assets",
  "icons",
  process.platform === "win32" ? "icon.ico" : "icon.png",
);
const packagedWebRoot = path.join(distRoot, "dist-web");

const readDesktopPackageConfig = () => {
  try {
    return JSON.parse(readFileSync(desktopPackagePath, "utf8")) as DesktopPackageConfig;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[electron] 项目配置读取失败: ${desktopPackagePath}\n${message}`);
    return {};
  }
};

const desktopPackageConfig = readDesktopPackageConfig();
const baseAppName = desktopPackageConfig.productName || desktopPackageConfig.name || "Ask Project";
const displayAppName = app.isPackaged ? baseAppName : `[DEV] ${baseAppName}`;

app.setName(displayAppName);

const createAppIcon = () => {
  const icon = nativeImage.createFromPath(windowIconPath);

  if (icon.isEmpty()) {
    console.warn(`[electron] 应用图标加载失败: ${windowIconPath}`);
  }

  return icon;
};

const registerPackagedWebProtocol = () => {
  protocol.handle(appScheme, (request) => {
    const requestUrl = new URL(request.url);
    const requestPath = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
    const filePath = path.join(packagedWebRoot, requestPath);
    const relativePath = path.relative(packagedWebRoot, filePath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      throw new Error(`非法静态资源路径：${requestPath}`);
    }

    return net.fetch(pathToFileURL(filePath).toString());
  });
};

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
  const appIcon = createAppIcon();

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1100,
    minHeight: 720,
    title: displayAppName,
    icon: appIcon,
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
  if (app.isPackaged) {
    registerPackagedWebProtocol();
  }

  if (process.platform === "darwin") {
    app.dock?.setIcon(createAppIcon());
  }

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
