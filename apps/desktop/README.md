# Ask Project Desktop

桌面端主线技术栈是 Electron + Rust sidecar + React/Next + shadcn/Radix + Tailwind v4。React 页面运行在 `4000`，Electron 负责打开 Chromium 窗口，Rust sidecar 负责本地原生能力。

## 目录作用

- `electron`：Electron 主进程和 preload。
  - `main.ts` 创建桌面窗口、注册 IPC、调用 Rust native。
  - `preload.ts` 暴露 `window.askProjectDesktop` 给 React。
  - `tsconfig.json` 将 Electron TS 源码编译到 `dist/dist-electron`。
  - `assets/icons` 存放桌面端图标资源。
- `electron-builder.yml`：macOS/Windows 安装包构建配置。
- `native`：Rust sidecar。
  - `src/main.rs` 提供配置读写、偏好读写、打开项目路径等原生能力。
  - 通过 stdin/stdout JSON 协议和 Electron 主进程通信。
- `src/app`：Next App Router 页面、布局和全局样式。
- `src/components`：业务组件，例如 Header、Tab、背景、偏好设置。
- `src/components/ui`：shadcn/Radix 基础组件。
- `src/hooks`：全局可调用 UI 能力和 React hooks。
- `src/lib`：通用工具和运行时 adapter，例如 `desktopRuntime.ts`。
- `dist`：桌面端统一构建产物目录。
  - `dist-electron` 是 Electron 编译产物。
  - `dist-web` 是 Next 静态导出产物。
  - `dist-rust` 是 Rust native 的 Cargo target 产物。
  - `dist-native` 是 release 打包时暂存当前目标平台 Rust sidecar 的目录。
  - `dist-release` 是 `.app`、`.dmg`、`.exe` 等 release 产物。

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
pnpm --filter desktop native:compile
pnpm --filter desktop electron:compile
```

开发启动只编译必要内容，不主动清理 `dist` 下的产物；开发缓存、增量编译和 dev server 状态交给各自工具控制。

## 常用命令

```bash
pnpm --filter desktop dev
pnpm dev:app
pnpm dev:app:tools
pnpm electron:desktop
pnpm electron:desktop:tools
pnpm --filter desktop native:compile
pnpm --filter desktop electron:compile
pnpm --filter desktop electron:build
pnpm --filter desktop native:check
pnpm --filter desktop lint
pnpm build:desktop
pnpm --filter desktop electron:smoke
pnpm release:desktop
pnpm release:desktop:all
pnpm release:desktop:mac
pnpm release:desktop:mac:arm64
pnpm release:desktop:mac:x64
pnpm release:desktop:win
pnpm release:desktop:win:x64
```

`electron:smoke` 需要 `http://localhost:4000` 已经启动。它会加载页面，并验证 renderer -> preload -> Electron IPC -> Rust native 链路。

## 构建产物

桌面端所有构建产物统一收口到 `dist`：

```text
apps/desktop/dist/
├── dist-electron/
├── dist-web/
├── dist-rust/
├── dist-native/
└── dist-release/
```

- `dist-electron`：`pnpm --filter desktop electron:build` 输出。
- `dist-web`：`pnpm build:desktop` 中 Next 静态导出输出。
- `dist-rust`：`pnpm --filter desktop native:build` 输出。
- `dist-native`：release 脚本根据当前目标平台/架构从 `dist-rust` 拷贝出的 sidecar 暂存目录。
- `dist-release`：`pnpm release:desktop:mac` 或 `pnpm release:desktop:win` 输出。

构建命令会先清理自己负责的历史产物：

- `pnpm build:desktop` 清理 `dist/dist-web`。
- `pnpm --filter desktop electron:build` 清理 `dist/dist-electron`。
- `pnpm --filter desktop native:build` 和 `native:build:release` 清理 `dist/dist-rust`。
- `pnpm release:desktop:*` 清理 `dist/dist-release`、`dist/dist-rust`、`dist/dist-native`，再按目标平台/架构重新生成。

开发命令不做这些清理，例如 `pnpm dev:app`、`pnpm electron:desktop`、`pnpm --filter desktop electron:smoke` 使用 `compile` 脚本。

macOS 构建会生成 `.app`、`.dmg`、`.zip`。`pnpm release:desktop:mac` 会依次构建 `mac:arm64` 和 `mac:x64`；也可以用 `pnpm release:desktop:mac:arm64` 或 `pnpm release:desktop:mac:x64` 指定单个架构。

Windows 构建会生成 NSIS `.exe` 和 `.zip`。`pnpm release:desktop:win` 当前构建 `win:x64`；macOS 上交叉构建需要：

```bash
rustup target add x86_64-pc-windows-gnu
brew install mingw-w64
```

全部已配置平台可以用 `pnpm release:desktop:all`，但它要求当前环境具备对应平台的 Rust target 和打包能力。

打包后的 Electron 应用只运行静态页面、Electron 编译产物和 Rust sidecar，不需要 `node_modules`。React、Next、shadcn/Radix、Tailwind 等构建期依赖应放在 `devDependencies`，避免 Electron Builder 把整套依赖打进 `.app` / `.exe`。

Electron/Chromium 运行时是桌面包体积的主要来源。当前只保留 `en`、`en-US`、`zh_CN`、`zh-CN` Electron 语言包，避免把所有 locale 打进安装包。

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
