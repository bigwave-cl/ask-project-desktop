# Ask Project Web

官网使用 Nuxt 4，目标域名是 `project.askmewhy.cn`。当前官网还处在基础脚手架阶段，后续内容和规则会单独补充。

## 目录作用

- `app`：Nuxt 应用入口。
- `public`：静态资源。
- `nuxt.config.ts`：Nuxt 配置。
- `AGENTS.md`：官网 agent 规则占位，后续补充。

## 启动命令

开发服务端口是 `4001`：

```bash
pnpm --filter web dev
```

构建：

```bash
pnpm --filter web build
```

静态生成：

```bash
pnpm --filter web generate
```

本地预览：

```bash
pnpm --filter web preview
```

也可以使用根目录转发命令：

```bash
pnpm dev:web
pnpm build:web
pnpm generate:web
pnpm preview:web
```
