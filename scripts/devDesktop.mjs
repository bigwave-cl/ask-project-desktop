import { spawn } from "node:child_process";

const devUrl = "http://localhost:4000";
const shouldOpenDevTools = process.argv.includes("--tools");
const commandName = shouldOpenDevTools ? "electron:desktop:tools" : "electron:desktop";

let frontendProcess = null;
let electronProcess = null;
let isShuttingDown = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isDevServerReady = async () => {
  try {
    const response = await fetch(devUrl, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

const spawnProcess = (command, args) =>
  spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

const stopChild = (child) => {
  if (!child || child.killed) {
    return;
  }

  child.kill("SIGINT");
  setTimeout(() => {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }, 1500).unref();
};

const shutdown = (code = 0) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  stopChild(electronProcess);
  stopChild(frontendProcess);
  setTimeout(() => process.exit(code), 200).unref();
};

const waitForDevServer = async () => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 45_000) {
    if (await isDevServerReady()) {
      return;
    }
    await sleep(500);
  }
  throw new Error(`${devUrl} 在 45 秒内没有就绪`);
};

const start = async () => {
  const alreadyReady = await isDevServerReady();

  if (alreadyReady) {
    console.log(`[dev:app] 复用已启动的 ${devUrl}`);
  } else {
    console.log("[dev:app] 启动桌面端前端服务...");
    frontendProcess = spawnProcess("pnpm", ["dev:desktop"]);
    frontendProcess.on("exit", (code) => {
      if (!isShuttingDown && code !== 0) {
        console.error(`[dev:app] 前端服务异常退出，退出码：${code}`);
        shutdown(code ?? 1);
      }
    });
    await waitForDevServer();
  }

  console.log(`[dev:app] 启动 ${shouldOpenDevTools ? "带 DevTools 的 " : ""}Electron 桌面壳...`);
  electronProcess = spawnProcess("pnpm", [commandName]);
  electronProcess.on("exit", (code) => {
    shutdown(code ?? 0);
  });
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

start().catch((error) => {
  console.error(`[dev:app] ${error instanceof Error ? error.message : String(error)}`);
  shutdown(1);
});
