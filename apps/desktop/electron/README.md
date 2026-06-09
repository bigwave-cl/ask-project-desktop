# Ask Project Electron 桌面壳

这个目录维护 Ask Project 桌面端的 Electron 主进程和 preload。当前桌面主线是 Electron + Rust + React：Electron 负责窗口和 Chromium WebView，Rust sidecar 负责本地原生能力，React/Next 负责界面。

Electron 源码使用 TypeScript 编写，`main.ts` 和 `preload.ts` 会先编译到 `electron/dist`，再由 Electron 运行编译后的 JS。

## 启动方式

先确保桌面前端已经运行在 4000：

```bash
pnpm --filter desktop dev
```

再启动 Electron 桌面壳：

```bash
pnpm electron:desktop
```

需要打开 DevTools：

```bash
pnpm electron:desktop:tools
```

## 配置

默认加载 `http://localhost:4000`。如果要换地址：

```bash
ASK_PROJECT_ELECTRON_URL=http://localhost:4000 pnpm electron:desktop
```

## Smoke Test

用于确认 Electron 能加载当前页面，加载成功后会自动退出：

```bash
pnpm --filter desktop electron:smoke
```

## Rust Native

Electron 启动前会先执行：

```bash
pnpm --filter desktop native:build
pnpm --filter desktop electron:build
```

主进程通过 IPC 调用 `apps/desktop/native` 编译出的 Rust sidecar。
