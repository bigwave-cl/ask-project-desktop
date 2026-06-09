import { access, chmod, copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const currentFile = fileURLToPath(import.meta.url);
const desktopRoot = path.resolve(path.dirname(currentFile), "..");
const distRoot = path.join(desktopRoot, "dist");
const distNativeRoot = path.join(distRoot, "dist-native");

const targets = {
  "mac:arm64": {
    platform: "mac",
    arch: "arm64",
    rustTarget: "aarch64-apple-darwin",
    nativeBinary: "ask-project-native",
    electronBuilderArgs: ["--mac", "--arm64"],
  },
  "mac:x64": {
    platform: "mac",
    arch: "x64",
    rustTarget: "x86_64-apple-darwin",
    nativeBinary: "ask-project-native",
    electronBuilderArgs: ["--mac", "--x64"],
  },
  "win:x64": {
    platform: "win",
    arch: "x64",
    rustTarget: "x86_64-pc-windows-gnu",
    nativeBinary: "ask-project-native.exe",
    electronBuilderArgs: ["--win", "--x64"],
  },
};

const targetGroups = {
  all: ["mac:arm64", "mac:x64", "win:x64"],
  mac: ["mac:arm64", "mac:x64"],
  win: ["win:x64"],
  current: [process.platform === "darwin" ? `mac:${process.arch === "arm64" ? "arm64" : "x64"}` : "win:x64"],
};

const run = (command, args, options = {}) => {
  console.log(`[desktop:release] ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: desktopRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`命令执行失败：${command} ${args.join(" ")}`);
  }
};

const getInstalledRustTargets = () => {
  const result = spawnSync("rustup", ["target", "list", "--installed"], {
    cwd: desktopRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    throw new Error("无法读取 rustup target 列表，请确认 rustup 已安装并可用。");
  }

  return new Set(result.stdout.split(/\r?\n/).map((item) => item.trim()).filter(Boolean));
};

const resolveRequestedTargets = () => {
  const requested = process.argv.slice(2);
  const tokens = requested.length > 0 ? requested : ["current"];
  const resolved = [];

  for (const token of tokens) {
    if (targetGroups[token]) {
      resolved.push(...targetGroups[token]);
      continue;
    }

    if (targets[token]) {
      resolved.push(token);
      continue;
    }

    throw new Error(`未知构建目标：${token}。可用目标：current, mac, win, all, ${Object.keys(targets).join(", ")}`);
  }

  return Array.from(new Set(resolved));
};

const prepareSharedArtifacts = async () => {
  await rm(path.join(distRoot, "dist-release"), { recursive: true, force: true });
  await rm(path.join(distRoot, "dist-rust"), { recursive: true, force: true });
  await rm(distNativeRoot, { recursive: true, force: true });
  run("pnpm", ["build"]);
  run("pnpm", ["electron:build"]);
};

const buildNativeForTarget = async (target) => {
  const installedRustTargets = getInstalledRustTargets();
  if (!installedRustTargets.has(target.rustTarget)) {
    throw new Error(`缺少 Rust target：${target.rustTarget}。请先执行：rustup target add ${target.rustTarget}`);
  }

  await rm(distNativeRoot, { recursive: true, force: true });
  await mkdir(distNativeRoot, { recursive: true });

  run("cargo", [
    "build",
    "--release",
    "--manifest-path",
    "native/Cargo.toml",
    "--target-dir",
    "dist/dist-rust",
    "--target",
    target.rustTarget,
  ]);

  const nativeSource = path.join(distRoot, "dist-rust", target.rustTarget, "release", target.nativeBinary);
  const nativeTarget = path.join(distNativeRoot, target.nativeBinary);

  await access(nativeSource);
  await copyFile(nativeSource, nativeTarget);
  if (target.platform !== "win") {
    await chmod(nativeTarget, 0o755);
  }

  console.log(`[desktop:release] 已暂存 native ${target.platform}:${target.arch} -> ${path.relative(desktopRoot, nativeTarget)}`);
};

const buildElectronForTarget = (target) => {
  run("electron-builder", [...target.electronBuilderArgs, "--config", "electron-builder.yml"]);
};

const main = async () => {
  const targetNames = resolveRequestedTargets();

  await prepareSharedArtifacts();

  for (const targetName of targetNames) {
    const target = targets[targetName];
    console.log(`[desktop:release] 开始构建 ${targetName}`);
    await buildNativeForTarget(target);
    buildElectronForTarget(target);
  }
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[desktop:release] ${message}`);
  process.exit(1);
});
