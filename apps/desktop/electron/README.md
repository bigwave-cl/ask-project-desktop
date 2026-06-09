# Ask Project Electron 桌面壳

这个目录维护 Ask Project 桌面端的 Electron 主进程和 preload。当前桌面主线是 Electron + Rust + React：Electron 负责窗口和 Chromium WebView，Rust sidecar 负责本地原生能力，React/Next 负责界面。

Electron 源码使用 TypeScript 编写，`main.ts` 和 `preload.ts` 会先编译到 `apps/desktop/dist/dist-electron`，再由 Electron 运行编译后的 JS。

## 目录作用

- `main.ts`：Electron 主进程，创建窗口、注册 IPC、调用 Rust sidecar。
- `preload.ts`：安全暴露 `window.askProjectDesktop` 给 React。
- `assets/icons`：桌面端图标资源，包含 macOS、Windows 和通用 PNG 图标。
- `tsconfig.json`：Electron TypeScript 编译配置，输出到 `../dist/dist-electron`。
- `../electron-builder.yml`：Electron release 构建配置，输出到 `../dist/dist-release`。

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

打包后的应用不再依赖 `4000`，会通过 `ask-project://` 协议加载 `dist/dist-web` 里的静态页面。

## Smoke Test

用于确认 Electron 能加载当前页面，加载成功后会自动退出：

```bash
pnpm --filter desktop electron:smoke
```

## Rust Native

Electron 启动前会先执行：

```bash
pnpm --filter desktop native:compile
pnpm --filter desktop electron:compile
```

主进程通过 IPC 调用 `apps/desktop/native` 编译出的 Rust sidecar。

`native:compile` 和 `electron:compile` 用于开发，不主动清理构建目录；`native:build` 和 `electron:build` 用于构建，会先清理对应的历史产物。

release 打包时由 `../scripts/releaseDesktop.mjs` 按目标平台/架构编译 Rust sidecar，并将当前目标的二进制暂存到 `../dist/dist-native` 后再交给 Electron Builder。这样 `mac:arm64`、`mac:x64`、`win:x64` 不会混用错误平台的 native 二进制。
