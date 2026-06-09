# Ask Project Desktop

桌面端主线技术栈是 Electron + Rust sidecar + React/Next + shadcn/Radix + Tailwind v4。React 页面运行在 `4000`，Electron 负责打开 Chromium 窗口，Rust sidecar 负责本地原生能力。

## 目录作用

- `electron`：Electron 主进程和 preload。
  - `main.ts` 创建桌面窗口、注册 IPC、调用 Rust native。
  - `preload.ts` 暴露 `window.askProjectDesktop` 给 React。
  - `tsconfig.json` 将 Electron TS 源码编译到 `electron/dist`。
- `native`：Rust sidecar。
  - `src/main.rs` 提供配置读写、偏好读写、打开项目路径等原生能力。
  - 通过 stdin/stdout JSON 协议和 Electron 主进程通信。
- `src/app`：Next App Router 页面、布局和全局样式。
- `src/components`：业务组件，例如 Header、Tab、背景、偏好设置。
- `src/components/ui`：shadcn/Radix 基础组件。
- `src/hooks`：全局可调用 UI 能力和 React hooks。
- `src/lib`：通用工具和运行时 adapter，例如 `desktopRuntime.ts`。
- `src-tauri`：旧 Tauri 实现保留目录，仅作为参考和回退材料，当前主线不再使用。

## 启动方式

推荐用一个命令同时启动 React/Next 页面和 Electron 桌面壳：

```bash
pnpm dev:app
```

需要同时打开 DevTools：

```bash
pnpm dev:app:tools
```

也可以拆成两个终端手动启动。先启动 React/Next 页面：

```bash
pnpm --filter desktop dev
```

再启动 Electron 桌面壳：

```bash
pnpm electron:desktop
```

需要调试 Electron/Chromium：

```bash
pnpm electron:desktop:tools
```

`pnpm dev:app` 会先检查 `http://localhost:4000` 是否已启动；如果没有，会自动启动前端服务，等页面可访问后再启动 Electron。

Electron 启动前会自动执行：

```bash
pnpm --filter desktop native:build
pnpm --filter desktop electron:build
```

## 常用命令

```bash
pnpm --filter desktop dev
pnpm dev:app
pnpm dev:app:tools
pnpm electron:desktop
pnpm electron:desktop:tools
pnpm --filter desktop electron:build
pnpm --filter desktop native:check
pnpm --filter desktop lint
pnpm build:desktop
pnpm --filter desktop electron:smoke
```

`electron:smoke` 需要 `http://localhost:4000` 已经启动。它会加载页面，并验证 renderer -> preload -> Electron IPC -> Rust native 链路。

## 原生能力约定

React 不直接访问 Node API，也不直接访问 Rust 二进制。调用链路固定为：

```text
React -> desktopRuntime.invoke -> preload -> Electron IPC -> Rust sidecar
```

新增原生能力时：

1. 在 `native/src/main.rs` 增加 Rust command。
2. 保持 stdin/stdout JSON 返回结构 `{ ok, data, error }`。
3. 在 React 侧通过 `src/lib/desktopRuntime.ts` 调用。
4. 浏览器环境需要保留 fallback 或友好提示。

## 规范

- 样式必须完全复刻原 Vue 项目，不自行发挥。
- 每完成一个复刻功能，更新 `../../docs/feature-replication-checklist.md`。
- 组件文件和组件名使用大驼峰。
- hooks、函数、工具文件使用小驼峰。
- 基础组件优先放在 `src/components/ui`，业务组件基于基础组件封装。
- 弹窗、菜单、Toast 优先使用 shadcn/Radix 对应组件。
- 禁止继续使用 `window.prompt` 和 `window.confirm`。
- Rust 代码需要写适合学习的注释。

详细规则见 `AGENTS.md`。
