import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const desktopRoot = path.resolve(path.dirname(currentFile), "..");
const distRoot = path.join(desktopRoot, "dist");
const allowedTargets = new Set(["dist-electron", "dist-web", "dist-rust", "dist-native", "dist-release"]);
const targets = process.argv.slice(2);

if (targets.length === 0) {
  throw new Error("请指定要清理的构建产物目录，例如：dist-web 或 dist-release。");
}

for (const target of targets) {
  if (!allowedTargets.has(target)) {
    throw new Error(`不允许清理 ${target}，只能清理：${Array.from(allowedTargets).join(", ")}`);
  }

  const targetPath = path.join(distRoot, target);
  await rm(targetPath, { recursive: true, force: true });
  console.log(`[desktop] 已清理 ${path.relative(desktopRoot, targetPath)}`);
}
