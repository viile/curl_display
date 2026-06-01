# cURL Runner

一个适配 PC 的 curl 工具站：左右分栏，左边输入 / 格式化 curl 命令，点击按钮执行，右边可视化展示状态码、响应头、响应体。

## 技术栈

- 前端：Vue 3 + Vite + TypeScript + Element Plus
- 后端（可选）：Node.js + Express，调用本机 `curl` 进程

## 功能

- ✅ 左右分栏 PC 布局
- ✅ curl 命令编辑器（行号、Tab=2 空格、快捷键）
- ✅ 一键格式化：每个 flag 一行，自动加续行符
- ✅ 压缩为单行 / 复制 / 清空
- ✅ **双执行引擎，工具栏一键切换**
  - **浏览器引擎**：把 curl 翻译为 `fetch()`，直接在用户浏览器发请求，无需 server
  - **本地代理引擎**：通过 Node server 调用本机 `curl`，完整支持所有 flag，绕过 CORS
- ✅ 失败时自动提示「改用本地代理重试」（一键切换并重跑）
- ✅ 结果展示：状态码 / 耗时 / 大小 / Content-Type / 响应头表格 / 响应体（JSON 自动美化高亮）
- ✅ 执行历史 + 用户授权（localStorage / cookie）
- ✅ 20 种语言 i18n + 浅色 / 深色 / 跟随系统 主题
- ✅ 快捷键：`⌘/Ctrl + Enter` 执行，`⌘/Ctrl + Shift + F` 格式化

## 两种部署模式

### 模式 A：纯静态（浏览器引擎）

适合托管在 GitHub Pages / Vercel / Cloudflare Pages 等静态站点。**完全不需要 Node server**。

```bash
npm install
npm run build           # 输出到 dist/
# 然后把 dist/ 部署到任意静态托管
```

或本地预览：

```bash
npm run dev:web         # 只起前端，端口 5173
```

> 限制：所有请求受浏览器 CORS / Fetch 规范约束。目标接口若未开放 CORS、需要修改 `User-Agent`/`Cookie` 等受限 header、或使用 `--proxy`/`--cacert`/`-T file:path` 等场景，请用模式 B。

### 模式 B：完整代理（本地代理引擎）

启动一个本机 Node server，curl 在你机器上以子进程方式执行，无 CORS、无 header 限制。

```bash
npm install
npm run dev             # 同时启前端 5173 + 后端 8787
```

或分开启动：

```bash
npm run dev:server      # 仅后端
npm run dev:web         # 仅前端
```

### 推荐做法

默认是「浏览器引擎」（无需启 server）。日常调一些公共 / 已开放 CORS 的 API 直接用即可；遇到调内网接口或被 CORS 拦截时，再起 server 并在工具栏切到「本地代理」。引擎选择会持久化到 localStorage。

## 浏览器引擎的限制（一定要知道）

浏览器沙箱决定了 fetch **不可能**完全等价于 curl。下列内容浏览器引擎会拒绝或忽略：

| curl 行为 | 浏览器引擎 | 备选 |
|---|---|---|
| 跨域且对方未配置 CORS | ❌ 被拦截 | 切到本地代理 |
| `-H 'User-Agent: ...'` `-H 'Referer: ...'` `-H 'Cookie: ...'` | ❌ 浏览器禁止 JS 修改 | 切到本地代理 |
| `-b/--cookie` 手动指定 cookie | ❌ 浏览器自动管理 | 切到本地代理 |
| `-x/--proxy` 自定义代理 | ❌ 浏览器走系统设置 | 切到本地代理 |
| `--cacert / --cert / --key` 自定义证书 | ❌ 浏览器 TLS 不可配置 | 切到本地代理 |
| `-k/--insecure` 跳过证书校验 | ❌ 浏览器拒绝 | 切到本地代理 |
| `-T file:path` 上传本地任意文件 | ❌ 无法直接读取 | 切到本地代理 |
| `-F file=@path` 表单上传本地文件 | ❌ 同上 | 切到本地代理 |
| 看中间 30x 跳转的完整 header 链 | ❌ 只能拿最终响应 | 切到本地代理 |
| 自定义 `Origin / Host / Referer` | ❌ 浏览器拒绝 | 切到本地代理 |
| 大部分常规 `-X / -H / -d / -F / --data-urlencode / -G / -u / Basic Auth` | ✅ 支持 | – |

如果命令包含上面任何被忽略的 flag，结果面板下方会以黄色提示框列出"被浏览器忽略的参数"。

## 安全提示

- 本地代理通过 `child_process.spawn('curl', argv)` 执行命令，**不经过系统 shell**，所以不存在 shell 注入风险。
- 但 server 会按用户输入向任意 URL 发请求，**仅推荐本机或可信网络内使用**，不要直接对公网暴露。
- 浏览器引擎下，所有请求都在用户浏览器内发出，不经过任何第三方服务器。

## 前置条件

- Node 18+（开发用）
- 模式 B 还需要本机安装 `curl`（macOS / Linux 自带；Windows 推荐 Git Bash 或 WSL）

## 开发脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 前端 + 后端同时跑 |
| `npm run dev:web` | 仅前端（用浏览器引擎时够用） |
| `npm run dev:server` | 仅后端 |
| `npm run build` | 构建静态资源到 `dist/` |
| `npm run preview` | 预览构建产物 |
