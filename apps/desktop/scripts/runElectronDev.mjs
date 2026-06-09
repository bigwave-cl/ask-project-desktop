import { spawn, spawnSync } from "node:child_process";
import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const currentFile = fileURLToPath(import.meta.url);
const desktopRoot = path.resolve(path.dirname(currentFile), "..");
const packageConfig = require(path.join(desktopRoot, "package.json"));
const electronExecutable = require("electron");
const electronMain = path.join(desktopRoot, "dist", "dist-electron", "main.js");
const displayName = `[DEV] ${packageConfig.productName || packageConfig.name || "Ask Project"}`;
const devAppRoot = path.join(desktopRoot, "dist", "dist-dev");
const devAppPath = path.join(devAppRoot, `${displayName}.app`);
const devElectronExecutable = path.join(devAppPath, "Contents", "MacOS", "Electron");
const sourceAppPath = path.resolve(path.dirname(electronExecutable), "..", "..");
const iconSourcePath = path.join(desktopRoot, "electron", "assets", "icons", "icon.icns");
const iconTargetName = "ask-project-dev.icns";
const iconTargetPath = path.join(devAppPath, "Contents", "Resources", iconTargetName);
const rawArgs = process.argv.slice(2);
const shouldOpenDevTools = rawArgs.includes("--tools");
const launchSwitchPrefixes = ["--inspect", "--inspect-brk", "--remote-debugging-port"];
const forwardedArgs = rawArgs.filter((arg) => arg !== "--tools" && arg !== "--");
const isLaunchSwitch = (arg) => launchSwitchPrefixes.some((prefix) => arg === prefix || arg.startsWith(`${prefix}=`));
const electronLaunchArgs = forwardedArgs.filter(isLaunchSwitch);
const appArgs = forwardedArgs.filter((arg) => !isLaunchSwitch(arg));

const runPlistBuddy = (args) => {
  const result = spawnSync("/usr/libexec/PlistBuddy", args, {
    cwd: desktopRoot,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`PlistBuddy 执行失败：${args.join(" ")}`);
  }
};

const setPlistString = (plistPath, key, value) => {
  const setResult = spawnSync("/usr/libexec/PlistBuddy", ["-c", `Set :${key} ${value}`, plistPath], {
    cwd: desktopRoot,
    stdio: "ignore",
  });

  if (setResult.status === 0) {
    return;
  }

  runPlistBuddy(["-c", `Add :${key} string ${value}`, plistPath]);
};

const prepareMacDevApp = async () => {
  await rm(devAppPath, { recursive: true, force: true });
  await mkdir(devAppRoot, { recursive: true });
  await cp(sourceAppPath, devAppPath, { recursive: true, dereference: true });
  await copyFile(iconSourcePath, iconTargetPath);

  const plistPath = path.join(devAppPath, "Contents", "Info.plist");
  setPlistString(plistPath, "CFBundleDisplayName", displayName);
  setPlistString(plistPath, "CFBundleName", displayName);
  setPlistString(plistPath, "CFBundleIdentifier", "cn.askmewhy.project.desktop.dev");
  setPlistString(plistPath, "CFBundleIconFile", iconTargetName);

  console.log(`[desktop:electron] 已准备开发应用壳：${path.relative(desktopRoot, devAppPath)}`);
};

const launchElectron = async () => {
  const executable = process.platform === "darwin" ? devElectronExecutable : electronExecutable;

  if (process.platform === "darwin") {
    await prepareMacDevApp();
  }

  const child = spawn(executable, [...electronLaunchArgs, electronMain, ...appArgs], {
    cwd: desktopRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      ASK_PROJECT_ELECTRON_DEV_APP_NAME: displayName,
      ASK_PROJECT_ELECTRON_DEVTOOLS: shouldOpenDevTools ? "1" : process.env.ASK_PROJECT_ELECTRON_DEVTOOLS,
    },
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
};

launchElectron().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[desktop:electron] ${message}`);
  process.exit(1);
});
