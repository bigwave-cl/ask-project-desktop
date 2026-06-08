# Ask Project 桌面版功能复刻清单

## 说明

- 原项目路径：`/Users/bobo/Desktop/joyme/ask/ask-project-manage/webview-app`
- 当前项目：Tauri + Next + React + shadcn/Radix + Tailwind v4
- 复刻规则：样式完全以原项目为准，不自行发挥；完成一个功能就勾选一个。
- 清单用途：作为桌面版复刻总账，后续每次迁移、修复、验证后都同步更新勾选状态。

## 基础框架与约束

- [x] 桌面端使用 Tauri + Next + React。
- [x] UI 基础使用 shadcn/Radix + Tailwind v4。
- [x] 桌面开发端口使用 `4000`。
- [x] 版本号使用年月日次格式，例如 `26.605.1`。
- [x] Rust 侧关键代码添加学习注释。
- [x] 全局可调用 UI 能力集中维护在 `apps/desktop/src/hooks`，例如 Toast、Confirm。
- [x] 文件与文件夹命名约定：函数、hooks、工具使用小驼峰，组件使用大驼峰。
- [x] 基础组件优先从 `apps/desktop/src/components/ui` 获取，业务组件基于 UI 组件封装。
- [x] 后续新增组件优先查 shadcn 文档；shadcn 没有对应组件时再自实现。
- [ ] 收敛现有原生 `<button>` / `<input>`：逐步替换为 `ui/Button`、`ui/Input` 或基于它们封装。
- [ ] 迁移过程中保持原 Vue 项目的组件边界，不把所有逻辑继续堆在 `page.tsx`。
- [ ] 建立桌面端统一的 project service 适配层：浏览器调试走 fallback，Tauri 环境走 `invoke`。
- [ ] 抽出并复用原项目类型模型：`ProjectItemModel`、`ProjectRenderItemModel`、`ProjectGroupItemModel`、`ProjectConfigItemModel`、`ProjectPreferencesModel`、`ProjectHudMetricKey`、`FormDataModel`。

## 主界面布局

- [x] 已有主界面壳层、sticky header、列表区域、HUD 区域雏形。
- [x] 复刻 `wrap.vue` 的 `ProjectManageBackground` 插入位置。
- [ ] 复刻 `apm-shell` 在有 Tab、无 HUD 场景下的布局状态。
- [ ] 复刻 sticky header 高度测量与 `--apm-sticky-safe-space` 联动。
- [ ] 复刻列表区域滚动、空状态居中、HUD spacer 预留空间。
- [ ] 移除不符合原项目结构的临时代码和临时布局。

## Header 与菜单

- [x] Header 已拆为独立组件，对齐 `commandHeader.vue` 的组件边界。
- [x] Header 下拉菜单已改为 Radix Dropdown Menu。
- [x] “设置”菜单项已打开偏好设置弹窗。
- [x] 导入菜单包含“导入工作区 / 导入文件夹 / 导入配置 / 导出配置”。
- [x] 更多菜单包含“添加分组 / 批量管理 / 设置 / 删除分组”。
- [ ] 导出配置子菜单需要继续确认方向自适应，复刻原 `exportSubmenuAlign` 行为。
- [ ] Header 图标、tooltip、hover、focus、菜单间距继续逐项对齐原 Vuetify 版本。
- [ ] 搜索框 clearable 行为需要对齐原 `v-text-field`。

## Canvas 背景

- [x] 迁移 `background.vue` 为 React 组件，例如 `ProjectManageBackground`。
- [x] 迁移 `useBackground.ts` 为 React hook，例如 `useProjectBackground`。
- [x] 在主界面插入 Canvas 背景，位置对齐原 `ProjectManageBackground`。
- [x] 保留 `ask-project-manage-background__aura` 光晕层。
- [x] 保留 `ask-project-manage-background__canvas` canvas 层。
- [x] 保留 resize observer，根据父容器尺寸调整 canvas。
- [x] 保留 DPR 适配，避免高清屏模糊。
- [x] 保留动画循环、暂停/恢复、卸载销毁逻辑。
- [x] 保留原 `useBackground.ts` 的绘制算法、色彩、粒子/线条/符号节奏。
- [x] 验证 Canvas 在 4000 浏览器调试中非空、不卡顿、不遮挡 UI。
- [ ] 验证 Canvas 在 Tauri WebView 中非空、不卡顿、不遮挡 UI。

## 分组与项目列表

- [x] 已有分组 Tab 和项目过滤雏形。
- [x] 搜索已覆盖项目名、路径、来源、分组、类型。
- [x] 复刻 `tab.vue` 的显示条件：分组数量大于 1 时显示。
- [x] 复刻 `buildGroupList`：固定“全部”，后接配置分组。
- [x] 复刻 active group 不存在时自动回到 `all`。
- [x] 复刻当前分组无项目与完全无分组两种空状态。
- [x] 复刻空状态按钮：添加分组、导入配置、导入文件夹、导入工作区。
- [x] 复刻重复路径去重逻辑。
- [x] 复刻当前窗口路径匹配 `isSamePath`。

## 项目卡片

- [x] 已有卡片主体视觉、seal、rune name、short path 雏形。
- [x] 卡片右上角菜单改为 Radix Dropdown Menu。
- [x] 卡片菜单项复刻为“打开项目 / 编辑符名 / 复制路径 / 删除项目”。
- [x] 移除当前不属于原设计的底部 quick actions。
- [x] 复刻 `ask-project-manage-card--current` 当前窗口状态。
- [x] 复刻卡片 hover、当前状态、菜单 hover 的全部视觉细节。
- [x] 卡片菜单点击不能触发卡片打开。
- [x] 复制路径成功/失败走统一 Toast。
- [x] 删除项目走 ConfirmDialog，不再使用 `window.confirm`。

## 弹窗系统

- [x] 偏好设置已改为 Radix Dialog。
- [ ] 迁移 `infoDialog.vue` 为 React + Radix Dialog。
- [ ] InfoDialog 支持添加分组。
- [ ] InfoDialog 支持编辑分组名。
- [ ] InfoDialog 支持编辑项目名。
- [ ] InfoDialog 支持修改分组排序。
- [ ] InfoDialog 支持修改项目排序。
- [ ] 替换所有 `window.prompt`。
- [x] 迁移 `confirmDialog.vue` 为 Promise 式 ConfirmDialog。
- [x] ConfirmDialog 支持标题、内容、确认按钮、取消按钮、危险样式。
- [x] 替换所有 `window.confirm`。
- [ ] Dialog overlay、焦点管理、Esc 关闭、回车确认行为对齐原项目。

## 批量管理模式

- [ ] 迁移 `setting.vue` 为全屏批量管理模式。
- [ ] 点击“批量管理”打开全屏编辑界面，不再只显示 toast。
- [ ] 复刻顶部“编辑模式 / 保存 / 关闭”。
- [ ] 进入编辑模式时深拷贝当前配置，关闭不保存。
- [ ] 保存时提交完整 list 并刷新主界面。
- [ ] 支持分组编辑、删除、排序。
- [ ] 支持项目编辑、删除、排序。
- [ ] 空列表时显示原批量管理空状态。

## 拖拽排序

- [ ] 迁移 `draggable.vue` 的分组拖拽排序。
- [ ] 迁移嵌套项目拖拽排序。
- [ ] React 侧使用成熟拖拽库，不手写核心拖拽规则。
- [ ] 拖拽 handle、ghostClass、动画时长对齐原项目。
- [ ] 拖拽结束后只更新编辑态数据，保存后才落盘。

## 偏好设置

- [x] 默认激活 Panel 开关已迁移。
- [x] 底部 HUD 总开关已迁移。
- [x] HUD 指标开关已迁移。
- [x] 恢复默认、取消、保存结构已迁移。
- [ ] 保存后以 Tauri 后端返回值作为单一可信来源。
- [ ] “查看引导”打开真正的新手引导，不再只 toast。
- [ ] `autoOpenPanel` 后续需要接入 Tauri 启动/窗口行为。
- [ ] 偏好设置样式继续逐像素对齐 `preferenceSetting.vue`。

## 新手引导

- [ ] 迁移 `onboardingGuide.vue`。
- [ ] 支持 3 页引导：自动唤起、状态栏快捷入口、再次查看。
- [ ] 支持页码计数、进度点、上一页、下一页、我知道了。
- [ ] 支持状态栏图片预览弹窗。
- [ ] 迁移 `statusbar-guide.png` 资源。
- [ ] 首次打开时根据 `should_show_onboarding` 决定是否展示。
- [ ] 完成后调用 `mark_onboarding_seen` 并持久化。
- [ ] 从偏好设置中可再次打开引导。

## Toast 与反馈

- [x] 迁移 `toast.vue`。
- [x] 迁移 `toast.ts` 调用方式。
- [x] 替换当前单行状态文字 `toast`。
- [x] 所有已实现流程的成功、失败、导入导出结果统一走 Toast。
- [x] Toast 样式、动画、自动消失时长对齐原项目。

## Tauri 原生能力

- [x] 已有 `get_config_list`。
- [x] 已有 `update_project_list_all`。
- [x] 已有 `get_preferences`。
- [x] 已有 `update_preferences`。
- [x] 已有 `open_project_path` 雏形。
- [ ] 补齐 `choose_folder`，支持多选文件夹。
- [ ] 补齐 `choose_workspace`，支持多选 `.code-workspace`。
- [ ] 补齐 `import_config`，支持 JSON / YML。
- [ ] 补齐 `export_config`，支持 JSON / YML 原生保存。
- [ ] 补齐 `remove_project_list`。
- [ ] 补齐 `clear_project_list`。
- [ ] 补齐 `should_show_onboarding`。
- [ ] 补齐 `mark_onboarding_seen`。
- [ ] 补齐前端刷新事件，等价原 `updateConfigPanel`。
- [ ] 补齐当前窗口路径事件，等价原 `updateWindowInfo`。
- [ ] 打包后验证用户不需要安装 Node、Rust、Cargo。

## 数据持久化

- [x] 当前 Tauri 侧已将配置写入 app data。
- [x] 当前 Tauri 侧已将偏好写入 app data。
- [ ] 配置文件结构保持兼容原 `ProjectConfigItemModel[]`。
- [ ] 导入旧配置时保留 key、label、children、type、path、source、name。
- [ ] 导入异常时不破坏现有配置。
- [ ] 删除分组、删除项目、批量保存都走同一套持久化入口。
- [ ] 浏览器 fallback 数据只用于调试，不作为桌面正式数据来源。

## 官网 Nuxt4

- [ ] 官网功能单独建清单，例如 `docs/website-checklist.md`。
- [ ] 官网使用 Nuxt4。
- [ ] 官网开发端口使用 `4001`。
- [ ] 官网域名目标为 `project.askmewhy.cn`。
- [ ] 官网任务不混入桌面端复刻进度。

## 验证清单

- [ ] Markdown 清单能正常渲染，复选框格式正确。
- [ ] 每次迁移后更新本文件勾选状态。
- [x] `pnpm --filter desktop lint` 通过。
- [x] `pnpm build:desktop` 通过。
- [ ] `pnpm --filter desktop tauri:build` 通过。
- [x] 4000 浏览器调试验证核心交互。
- [ ] Tauri WebView 开发模式验证原生能力。
- [ ] 桌面打包产物验证无需安装开发依赖。
