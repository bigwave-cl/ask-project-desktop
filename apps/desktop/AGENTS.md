# Ask Project Desktop Agent Rules

本文件是给 Codex、Claude、Cursor、其他 AI agent 或自动化工具读取的桌面端项目规则。开始修改 `apps/desktop` 前，优先阅读并遵守这里的约束。

## 作用范围

- 本规则只适用于 `apps/desktop`。
- 本规则不直接约束 `apps/web` 官网；官网后续需要单独维护规则或清单。

## 项目背景

- 当前仓库：`ask-project-desktop`
- 桌面项目目录：`apps/desktop`
- 桌面版复刻源项目：`ask-project-manage/webview-app`
- 如果源项目不在同一台设备的固定位置，先通过仓库同级目录、用户提供路径或清单文档确认；不要依赖某台机器上的绝对路径。
- 桌面应用技术栈：Electron + Rust sidecar + Next + React + shadcn/Radix + Tailwind v4
- 桌面开发端口：`4000`
- 版本号格式：年月日次，例如 `26.605.1`

## 核心原则

- 样式必须完全复刻 `ask-project-manage/webview-app`，不要自行发挥视觉设计。
- 每完成一个复刻功能，必须自检，并更新 `docs/feature-replication-checklist.md`。
- 迁移时保持原 Vue 项目的组件边界，不要继续把所有逻辑堆进 `page.tsx`。
- 浏览器调试 fallback 只用于开发；桌面正式能力以 Electron IPC + Rust sidecar 为准。
- Rust 代码需要添加适合学习的注释，方便不熟悉 Rust 的维护者理解。
- 不要重置或覆盖用户未提交的改动。

## 命名与目录

- 组件文件和组件名使用大驼峰，例如 `ProjectCommandHeader.tsx`、`ProjectManageBackground.tsx`。
- hooks、函数、工具文件使用小驼峰，例如 `useProjectToast.tsx`、`mountReactComponent.tsx`。
- 全局可调用 UI 能力放在 `apps/desktop/src/hooks`，例如 Toast、Confirm、后续 InfoDialog。
- 基础 UI 组件放在 `apps/desktop/src/components/ui`。
- 业务组件基于 `components/ui` 组合封装。
- Next App Router 固定文件名保持框架约定，例如 `app/page.tsx`、`app/layout.tsx`。

## UI 组件规则

- 新增基础组件前，优先查看 shadcn 文档：`https://ui.shadcn.com/docs/components`
- 遇到 Switch、Select、Checkbox、Radio、Tooltip 等基础交互组件时，优先到 `https://www.shadcn-vue.com/docs/components` 查找对应组件的基础实现与结构，再结合当前 React/Radix 技术栈做二次封装。
- shadcn/Radix 已提供的组件必须优先使用或封装，例如：
  - `DropdownMenu`
  - `Dialog`
  - `AlertDialog`
  - `Sonner`
  - `Button`
  - `Input`
- shadcn 没有对应组件时，才允许自实现。
- 现有原生 `<button>`、`<input>` 需要在后续迁移中逐步收敛到 `ui/Button`、`ui/Input` 或基于它们封装。
- 图标按钮优先使用 `lucide-react` 图标。
- 不要把基础组件样式写散到业务组件里；业务组件只追加复刻原项目所需的 class。

## 复刻流程

1. 先阅读原 Vue 组件及其相关 composable、样式、类型。
2. 再阅读当前 React/Electron/Rust 实现和清单状态。
3. 按原项目组件边界迁移到 React。
4. 涉及弹窗、菜单、Toast 等基础交互时，优先使用 `components/ui` 中的 shadcn/Radix 封装。
5. 完成后在浏览器或 Electron 开发模式中自检。
6. 更新 `docs/feature-replication-checklist.md`，完成一个勾选一个。

## 已确定的复刻约束

- Header 必须是独立组件，对齐原 `commandHeader.vue`。
- Header 下拉菜单使用 Radix Dropdown Menu。
- 设置弹窗使用 Radix Dialog。
- 删除确认使用 Radix AlertDialog，并通过 Promise/纯函数方式调用。
- Toast 使用 Sonner，并通过 `useProjectToast` / `projectToast` 维护全局调用入口。
- Canvas 背景必须独立迁移，不允许合并成普通 CSS 背景。
- Canvas 背景需要保留 aura 层、canvas 层、resize、DPR、动画循环和销毁逻辑。
- 桌面原生能力通过 `apps/desktop/native` Rust sidecar 提供，Electron 主进程负责 IPC 转发。
- 拖拽排序必须使用成熟拖拽库，不手写核心拖拽规则。
- `window.prompt` 后续要替换为 InfoDialog。
- `window.confirm` 不允许继续使用。

## 验证要求

- 每个复刻功能都必须自行测试。
- 前端改动至少运行：
  - `pnpm --filter desktop lint`
  - `pnpm build:desktop`
- 已知本地桌面调试地址：`http://localhost:4000/`
- 桌面端调试优先使用 Electron 桌面壳的 Agent 调试链路，不要默认打开普通浏览器：
  - 如需启动壳子，优先使用 `pnpm dev:desktop:agent`，它会复用已启动的 `4000` 前端服务，并暴露 renderer CDP：`http://127.0.0.1:9222/json/list`。
  - 如壳子已启动且 `9222` 可用，直接使用 `pnpm debug:desktop:agent` 或 Playwright `chromium.connectOverCDP("http://127.0.0.1:9222")` 连接 Electron renderer 验证。
  - 不要擅自终止用户已启动的 `4000` 服务或 Electron 壳子；只在用户明确要求时重启。
  - 普通浏览器调试只作为 fallback，或在用户明确要求“浏览器/localhost 页面”时使用。
- 有 UI 变化时，优先在 Electron 桌面壳中检查真实页面：
  - 页面是否正常加载
  - 控制台是否有报错
  - 关键交互是否可点击
  - Toast/Dialog/Dropdown 是否在正确位置和状态出现
  - Canvas 是否非空、不遮挡 UI、不明显卡顿
  - Electron 桌面壳是否能加载 4000 并调用 Rust 原生能力
- 如果用户已手动启动服务，不要擅自终止或重启，除非用户明确要求。

## Git 与提交

- 允许存在未提交改动；不要回滚用户改动。
- 提交前需要整理变更范围。
- 用户要求提交时，使用 `$bobo-git-commit` skill，并先展示提交信息和统计，再按用户确认执行。
- 默认分支使用 `main`。
- 远程仓库：`https://github.com/bigwave-cl/ask-project-desktop.git`

## 重要文档

- 桌面复刻总清单：`docs/feature-replication-checklist.md`
- 官网后续清单：可单独创建 `docs/website-checklist.md`
