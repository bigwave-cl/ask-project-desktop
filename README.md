# Ask Project Desktop

Ask Project 是一个桌面项目管理工具，同时包含桌面端应用和后续官网。当前仓库采用 monorepo 结构，桌面端主线技术栈是 Electron + Rust sidecar + React/Next，官网技术栈是 Nuxt 4。

## 目录结构

- `apps/desktop`：桌面端应用。React/Next 负责 UI，Electron 负责桌面窗口，Rust sidecar 负责本地原生能力。
- `apps/desktop/electron`：Electron 主进程和 preload。主进程创建 Chromium 窗口，并通过 IPC 调用 Rust sidecar。
- `apps/desktop/electron/assets/icons`：Electron 桌面端图标资源。
- `apps/desktop/native`：Rust 原生能力层。当前负责配置读写、偏好读写、打开项目路径。
- `apps/desktop/src`：桌面端 React 业务代码、组件、hooks、样式和运行时 adapter。
- `apps/desktop/src/components/ui`：shadcn/Radix 基础 UI 组件。
- `apps/desktop/src/hooks`：全局可调用 UI 能力，例如 Toast、Confirm、InfoDialog、复制文本。
- `apps/web`：官网。使用 Nuxt 4，目标域名是 `project.askmewhy.cn`。
- `docs`：项目文档和复刻清单，例如 `feature-replication-checklist.md`。
- `AGENTS.md`：仓库级 agent 索引。修改具体 app 前先阅读对应 app 内的 `AGENTS.md`。

## 环境要求

- Node.js：建议使用当前项目已验证的 Node 22。
- pnpm：项目声明为 `pnpm@11.1.0`。
- Rust：通过 `rustup` 安装，用于编译 `apps/desktop/native`。

安装依赖：

```bash
pnpm install
```

## 启动命令

一条命令同时启动桌面前端和 Electron 桌面壳：

```bash
pnpm dev:app
```

一条命令启动桌面前端、Electron 桌面壳并打开 DevTools：

```bash
pnpm dev:app:tools
```

桌面端前端开发服务，端口 `4000`：

```bash
pnpm dev:desktop
```

Electron 桌面壳：

```bash
pnpm electron:desktop
```

带 DevTools 的 Electron 桌面壳：

```bash
pnpm electron:desktop:tools
```

`dev:app` / `dev:app:tools` 会先检查 `4000` 是否已启动；如果没有，会自动启动前端服务，等页面可访问后再启动 Electron。退出 Electron 时，由脚本启动的前端服务会一起退出。

官网开发服务，端口 `4001`：

```bash
pnpm dev:web
```

## 常用验证命令

桌面端 lint：

```bash
pnpm --filter desktop lint
```

桌面端 Next 构建：

```bash
pnpm build:desktop
```

Rust native 检查：

```bash
pnpm --filter desktop native:check
```

Electron smoke test，需要 `4000` 已启动：

```bash
pnpm --filter desktop electron:smoke
```

全仓 lint：

```bash
pnpm lint
```

## 开发规范

- 桌面端样式必须完全复刻原 `ask-project-manage/webview-app`，不要自行发挥视觉设计。
- 桌面端每完成一个复刻功能，都要自检并更新 `docs/feature-replication-checklist.md`。
- 组件文件和组件名使用大驼峰，例如 `ProjectCommandHeader.tsx`。
- hooks、函数、工具文件使用小驼峰，例如 `useProjectToast.tsx`、`desktopRuntime.ts`。
- 基础 UI 优先使用 `apps/desktop/src/components/ui` 中的 shadcn/Radix 封装。
- 新增 UI 组件前优先查 shadcn 文档；没有对应组件时再自实现。
- 桌面正式原生能力走 Electron IPC + Rust sidecar，浏览器 fallback 只用于开发调试。
- Rust 代码需要保留适合学习的注释，方便不熟悉 Rust 的维护者理解。
- 不要回滚或覆盖未提交的用户改动。

更详细的桌面端规则见 `apps/desktop/AGENTS.md`。
