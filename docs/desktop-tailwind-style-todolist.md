# 桌面端 Tailwind 样式治理 TODO

## 目标

- 暂缓继续复刻新功能，优先把桌面端现有业务样式从 `globals.css` 收敛到 Tailwind。
- 项目样式实现统一使用 Tailwind utilities、Tailwind arbitrary values 和全局 CSS 变量体系。
- 除真正全局样式外，不再新增组件级 CSS 选择器。
- 后续复刻功能必须默认使用 Tailwind，不再把业务组件样式写进 `globals.css`。

## 全局样式边界

允许保留在 `apps/desktop/src/app/globals.css`：

- `@import "tailwindcss"`、`@import "tw-animate-css"`。
- `@theme inline` 中的 Tailwind token 映射。
- `:root` 全局变量，例如颜色、radius、全局语义 token。
- `@layer base` 中的全局 reset、`html/body/a` 基础样式。
- 少量真正跨组件的全局 portal 基础样式，例如 Radix overlay/content 的最小定位骨架；后续也应评估是否能组件化。

不允许继续保留或新增：

- 页面业务选择器，例如 `.apm-command`、`.ask-project-manage-card`、`.apm-cockpit`。
- 组件私有结构选择器，例如 `__header`、`__body`、`__btn`。
- 通过 CSS 文件维护 hover、focus、active、selected 等组件状态。
- 为单个组件写 `@keyframes`、`@media`、伪元素样式，除非无法用 Tailwind 表达且经过确认。

## 当前样式盘点

- P1 迁移后基线：`apps/desktop/src/app/globals.css` 当前 2207 行。
- P1 迁移后业务 class 基线：`rg -o "\.(apm|ask-project-manage)[A-Za-z0-9_-]*" apps/desktop/src/app/globals.css | sort -u | wc -l` 当前为 113 个。
- P2 Info/Confirm 迁移后基线：`apps/desktop/src/app/globals.css` 当前 1853 行。
- P2 Info/Confirm 迁移后业务 class 基线：`rg -o "\.(apm|ask-project-manage)[A-Za-z0-9_-]*" apps/desktop/src/app/globals.css | sort -u | wc -l` 当前为 94 个。
- P2 Toast 迁移后基线：`apps/desktop/src/app/globals.css` 当前 1730 行。
- P2 Toast 迁移后业务 class 基线：`rg -o "\.(apm|ask-project-manage)[A-Za-z0-9_-]*" apps/desktop/src/app/globals.css | sort -u | wc -l` 当前为 86 个。
- P2 PreferenceSetting 迁移后基线：`apps/desktop/src/app/globals.css` 当前 1548 行。
- P2 PreferenceSetting 迁移后业务 class 基线：`rg -o "\.(apm|ask-project-manage)[A-Za-z0-9_-]*" apps/desktop/src/app/globals.css | sort -u | wc -l` 当前为 69 个。
- P3 DropdownMenu 迁移后基线：`apps/desktop/src/app/globals.css` 当前 1364 行。
- P3 DropdownMenu 迁移后业务 class 基线：`rg -o "\.(apm|ask-project-manage)[A-Za-z0-9_-]*" apps/desktop/src/app/globals.css | sort -u | wc -l` 当前为 58 个。
- P3 Header 迁移后基线：`apps/desktop/src/app/globals.css` 当前 1014 行。
- P3 Header 迁移后业务 class 基线：`rg -o "\.(apm|ask-project-manage)[A-Za-z0-9_-]*" apps/desktop/src/app/globals.css | sort -u | wc -l` 当前为 41 个。
- P5 Sticky 迁移后基线：`apps/desktop/src/app/globals.css` 当前 972 行。
- P5 Sticky 迁移后业务 class 基线：`rg -o "\.(apm|ask-project-manage)[A-Za-z0-9_-]*" apps/desktop/src/app/globals.css | sort -u | wc -l` 当前为 40 个。
- P5 Shell/Wrap 迁移后基线：`apps/desktop/src/app/globals.css` 当前 931 行。
- P5 Shell/Wrap 迁移后业务 class 基线：`rg -o "\.(apm|ask-project-manage)[A-Za-z0-9_-]*" apps/desktop/src/app/globals.css | sort -u | wc -l` 当前为 38 个。
- P4 List 迁移后基线：`apps/desktop/src/app/globals.css` 当前 874 行。
- P4 List 迁移后业务 class 基线：`rg -o "\.(apm|ask-project-manage)[A-Za-z0-9_-]*" apps/desktop/src/app/globals.css | sort -u | wc -l` 当前为 34 个。
- 主要业务样式集中在：
  - 卡片：`ask-project-manage-card`。
  - 空状态：`ask-project-manage-empty`、`apm-empty-*`。
  - HUD：`apm-cockpit`、`apm-hud-card`。
  - 弹窗：`apm-info-dialog`、`apm-confirm-dialog`、`apm-preferences`。
  - Toast：`apm-sonner`、`apm-toast`。
  - Tab：`ask-project-manage-tab`、`apm-tabs`、`apm-tab`。
- 新手引导 `ProjectOnboardingGuide` 已按 Tailwind-first 方式实现，可作为后续迁移参考。

## 迁移原则

- 优先保留组件边界：每个组件迁移自己的样式，不把样式逻辑搬回 `page.tsx`。
- 优先使用现有 `components/ui` 基础组件，并用 `cn()` 组合 Tailwind class。
- 动态样式只在确有运行时变量时使用 `style`，例如 canvas 尺寸、卡片动态色值、HUD 数值比例。
- 复杂重复样式可以在组件文件内抽成 class 常量或小型 variant helper，不新增 CSS 文件。
- 使用 `data-state`、`aria-selected`、`aria-pressed` 等状态属性配合 Tailwind 变体，不写全局状态选择器。
- 迁移一块，删除一块对应 CSS，避免 Tailwind 与旧 CSS 并存造成优先级冲突。

## 阶段 TODO

### P0：规则与基线

- [x] 明确 Tailwind-first 样式约束。
- [x] 将本 TODO 作为后续样式治理入口。
- [x] 统计 `globals.css` 业务选择器数量，建立迁移基线。
- [ ] 确认 `globals.css` 最终目标行数范围：仅保留 token/base/少量全局 portal 样式。
- [x] 后续每次迁移后运行 `pnpm --filter desktop lint`。
- [x] 后续每次迁移后运行 `pnpm build:desktop`。
- [x] UI 迁移后使用 Electron agent 做可见验证。

### P1：低风险独立组件

- [x] 迁移 `ProjectManageTab`：移除 `ask-project-manage-tab`、`apm-tabs`、`apm-tab`。
- [x] 迁移 `ProjectEmpty`：移除 `ask-project-manage-empty` 与空状态局部样式。
- [x] 迁移空状态按钮：使用 Tailwind class，移除 `.apm-empty-actions button`。
- [x] 迁移文件 input 隐藏样式：改为组件内 `className="hidden"`，移除 `.apm-file-input`。

### P2：弹窗与反馈系统

- [x] 迁移 `useProjectInfoDialog`：InfoDialog 改为通过 UI 组件 variant 使用 Tailwind 样式。
- [x] 迁移 `useProjectConfirm`：ConfirmDialog 复用 Dialog/Button/Input 等 UI 组件 variant。
- [x] 迁移 `ProjectPreferenceSetting`：移除 `.apm-preferences`、`.apm-preference-card`、`.apm-switch`、`.apm-hud-option`。
- [x] 迁移 `useProjectToast` / `Sonner`：移除 `.apm-sonner`、`.apm-toast`、`.apm-toast__*`。
- [x] 评估 Radix `Dialog` / `AlertDialog` 基础 overlay/content 是否保留为全局基础样式，或改为组件默认 Tailwind class。

### P3：Header 与菜单

- [x] 迁移 `ProjectCommandHeader` 主体：移除 `.apm-command` 及其结构样式。
- [x] 迁移搜索框与 clearable 行为样式：移除 `.apm-command__search*`。
- [x] 迁移导入组合按钮：移除 `.apm-import-control*`。
- [x] 迁移更多菜单按钮：移除 `.apm-command__icon-button`。
- [x] 迁移 DropdownMenu 基础样式：移除 `.apm-menu`、`.apm-menu__item`、`.apm-menu__divider` 等全局菜单样式。
- [x] 保留菜单打开方向与状态时，优先使用 Radix data attribute + Tailwind data variant。

### P4：项目列表与卡片

- [ ] 将 `ProjectCard` 从 `page.tsx` 抽成独立组件，避免继续堆在页面文件。
- [ ] 迁移卡片主体 Tailwind 样式：移除 `.ask-project-manage-card*`。
- [ ] 迁移卡片菜单 Tailwind 样式：移除 `.ask-project-manage-card__menu*`。
- [ ] 保留动态卡片渐变变量，但把静态布局、边框、hover、当前状态全部改为 Tailwind。
- [x] 迁移列表容器与 HUD spacer：移除 `.apm-list`、`.ask-project-manage-list`。

### P5：HUD 与主壳层

- [x] 迁移 `apm-shell` 到页面/布局组件 Tailwind。
- [x] 迁移 `apm-shell__sticky` 到页面/布局组件 Tailwind。
- [x] 迁移主背景包裹层 `ask-project-manage-wrap`，只保留必要 CSS 变量。
- [ ] 迁移 HUD 面板：移除 `.apm-cockpit*`。
- [ ] 迁移 HUD 卡片：移除 `.apm-hud-card*`。
- [ ] 动态指标比例继续用 CSS 变量或内联 style，但静态样式使用 Tailwind。

### P6：全局 CSS 清理收口

- [ ] 删除所有已迁移的业务选择器。
- [ ] 删除不再使用的 `@keyframes`。
- [ ] 删除不再使用的 `@media`。
- [ ] 使用 `rg "apm-|ask-project-manage"` 检查残留业务 class。
- [ ] 使用浏览器/Electron 检查核心界面无样式闪烁、错位、遮挡。
- [ ] 更新 `docs/feature-replication-checklist.md` 中“收敛现有原生 button/input”和“临时代码/临时布局”相关进度。

## 每块迁移验收标准

- 对应旧 CSS 已从 `globals.css` 删除。
- 组件视觉与迁移前一致或仅有可接受的微小差异。
- 组件状态完整：hover、focus、disabled、selected、open、danger 等。
- 响应式表现不退化。
- `pnpm --filter desktop lint` 通过。
- `pnpm build:desktop` 通过。
- Electron agent 可见验证通过。

## 暂停复刻规则

- 在 P1/P2/P3 完成前，原则上不继续新增大功能复刻。
- 若必须新增功能，必须同时使用 Tailwind-first 样式，不允许新增业务 CSS。
- 样式治理期间，优先提交小而聚焦的改动，避免一次迁移多个高风险模块。
