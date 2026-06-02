# cURL Runner

一个适配 PC 的 curl 工具站：左右分栏，左边输入 / 格式化 curl 命令，点击按钮执行，右边可视化展示状态码、响应头、响应体。

## 技术栈

- 前端：Vue 3 + Vite + TypeScript + Element Plus
- 桌面壳：Tauri 2（Rust + 系统 WebView）
- 后端（可选）：Node.js + Express，调用本机 `curl`

## 三种运行方式

| 模式 | 启动 | 真 curl | 无 CORS | 部署难度 |
|---|---|:---:|:---:|---|
| **A. 纯浏览器（默认）** | `npm run dev:web` 或 静态托管 | ❌ fetch 替代 | ❌ | 0：纯静态 |
| **B. 浏览器 + 本地 server** | `npm run dev` | ✅ | ✅ | 需 Node |
| **C. 桌面应用** | `npm run tauri:dev` | ✅ | ✅ | 用户下载 .dmg/.exe |

页面工具栏的「引擎切换器」会自动适配运行环境：
- 在浏览器中：可在 `Browser ↔ Local proxy` 间切换
- 在桌面应用中：固定为 `Desktop`（隐藏切换器，显示徽章）

浏览器引擎遇到 CORS 错误时，错误面板会同时给出两个出路：
1. **改用本地代理重试** —— 切到 server engine
2. **下载桌面应用** —— 跳转到 GitHub Releases 下载 .dmg/.exe/.AppImage

下载链接配置在 [`src/config/links.ts`](src/config/links.ts) 中的 `DESKTOP_DOWNLOAD_URL`，fork 后改成自己的 release 地址。

## 功能

- ✅ 左右分栏 PC 布局
- ✅ curl 命令编辑器（行号、Tab=2 空格、快捷键）
- ✅ 一键格式化 / 压缩为单行 / 复制 / 清空
- ✅ **三引擎可切换**（browser fetch / local server / desktop Rust 调 curl）
- ✅ 失败时智能提示「改用本地代理」+「下载桌面应用」
- ✅ 结果展示：状态码 / 耗时 / 大小 / Content-Type / 响应头表格 / 响应体（JSON 自动美化高亮）
- ✅ 执行历史 + 用户授权（localStorage / cookie）
- ✅ 20 种语言 i18n + 浅色 / 深色 / 跟随系统 主题
- ✅ 快捷键：`⌘/Ctrl + Enter` 执行，`⌘/Ctrl + Shift + F` 格式化

## 浏览器引擎的限制

浏览器沙箱决定了 fetch **不可能**完全等价于 curl。下列内容浏览器引擎会拒绝或忽略，命中后下方会有黄色警告框列出：

| curl 行为 | 浏览器引擎 | 桌面 / 本地代理 |
|---|---|---|
| 跨域且对方未配置 CORS | ❌ 被拦截 | ✅ |
| `-H 'User-Agent / Referer / Cookie: ...'` | ❌ 浏览器禁止 | ✅ |
| `-b/--cookie` 手动指定 cookie | ❌ | ✅ |
| `-x/--proxy` 自定义代理 | ❌ | ✅ |
| `--cacert / --cert / --key / -k` 自定义/跳过 TLS | ❌ | ✅ |
| `-T file:path` 上传本地任意文件 | ❌ | ✅ |
| 看中间 30x 跳转的完整 header 链 | ❌ 只能拿最终响应 | ✅ |
| 常规 `-X / -H / -d / -F / --data-urlencode / -G / -u / Basic Auth` | ✅ | ✅ |

## 开发启动

### 浏览器模式（默认）

```bash
npm install
npm run dev:web      # 仅前端，端口 5173
```

### 浏览器 + 本地代理模式

```bash
npm install
npm run dev          # 同时启前端 5173 + 后端 8787
```

### 桌面应用模式（需要 Rust 工具链）

先安装 Rust：

```bash
# macOS / Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 或者用 Homebrew (macOS)
brew install rust
```

然后：

```bash
npm install
npm run tauri:dev    # 启动桌面应用（开发模式，带热更新）
```

第一次启动会 cargo build 全部依赖，耗时数分钟。

## 打包桌面应用

### 本地打包当前平台

```bash
npm run tauri:build
```

产物位于：

- macOS：`src-tauri/target/release/bundle/dmg/*.dmg` & `*.app`
- Windows：`src-tauri/target/release/bundle/{msi,nsis}/`
- Linux：`src-tauri/target/release/bundle/{appimage,deb}/`

### 自动跨平台发布（推荐）

仓库内置 `.github/workflows/release.yml`，推一个 `v*` 标签即可在 GitHub Actions 上同时构建 **macOS (arm64/x64) / Windows / Linux** 四个产物，自动创建 Release 草稿。

```bash
git tag v1.0.0
git push origin v1.0.0
```

在 GitHub Releases 页面发布草稿即可。`DESKTOP_DOWNLOAD_URL` 默认指向 `releases/latest`，无需改动。

## 前置条件

- Node 18+（前端 / 本地代理 / Tauri）
- Rust 1.77+（仅桌面打包需要）
- 模式 B / C 还需本机安装 `curl`（macOS / Linux 自带；Windows 10+ 也自带 `curl.exe`）

## 安全提示

- 本地代理 server 通过 `child_process.spawn('curl', argv)` 执行命令，**不经过系统 shell**，无 shell 注入风险。
- 桌面应用通过 Rust `tokio::process::Command` 同理，无 shell 注入。
- server 会按用户输入向任意 URL 发请求，**仅推荐本机或可信网络内使用**，不要直接对公网暴露。
- 浏览器引擎下，所有请求都在用户浏览器内发出，不经过任何第三方服务器。

## 开发脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 前端 + 后端同时跑 |
| `npm run dev:web` | 仅前端 |
| `npm run dev:server` | 仅后端 |
| `npm run build` | 构建前端到 `dist/` |
| `npm run preview` | 预览构建产物 |
| `npm run tauri:dev` | 启动 Tauri 桌面应用（开发模式） |
| `npm run tauri:build` | 打包桌面应用（当前平台） |
| `npm run tauri` | 直接执行 tauri CLI，传入子命令 |

## SEO / 搜索引擎收录

为方便 Google / Bing 等收录，仓库已经做好了下列基础设施。Fork 后基本只需要改两处即可：

1. `src/config/seo.ts` — 站点 URL、品牌名、OG 图、作者信息
2. `index.html` — 把所有 `https://viile.github.io/curl_display/` 改成你的部署地址（canonical / hreflang / OG / Twitter / JSON-LD）

`public/` 下的 `robots.txt`、`sitemap.xml`、`site.webmanifest` 里的 URL 也要同步改。

### 内置的 SEO 能力

| 能力 | 实现 |
|---|---|
| 完整 `<meta>` | description / keywords / author / theme-color / color-scheme / robots / canonical |
| Open Graph + Twitter Card | og:type/title/description/url/image/site_name/locale + summary_large_image |
| 多语言 `hreflang` | 20 种语言 + `x-default`，URL 用 `?lang=xx-XX` 区分（已对 i18n 接入） |
| JSON-LD 结构化数据 | `WebApplication` schema：名称、描述、URL、作者、特性列表、`inLanguage` 20 项 |
| `robots.txt` + `sitemap.xml` | 标准 sitemap，每个 URL 内嵌 `xhtml:link rel="alternate" hreflang=` |
| `site.webmanifest` | PWA 基本信息（名称、图标、theme color） |
| `noscript` 首屏文本 | 给爬虫和无 JS 用户一个可读骨架（包含产品介绍、Github 链接） |
| 动态 SEO 更新 | `src/composables/useSeo.ts` 监听 locale 变化，运行时同步 `<title>` / `<meta>` |
| URL 语言路由 | `?lang=zh-CN` 等优先级最高，切语言时通过 `replaceState` 写回 URL |

### `?lang=` 参数 = 给每种语言独立可收录的 URL

由于这是个 SPA，没有真正的 per-language 路径，所以用查询参数：

- `https://your-site/` — 用户浏览器语言 / localStorage 决定
- `https://your-site/?lang=zh-CN` — 强制中文，可直接分享
- `https://your-site/?lang=en-US` — 强制英文

`hreflang` 与 sitemap 都按这套约定写好了，Google 会把每种语言索引成独立结果。

### 部署到 GitHub Pages（仓库默认假设）

```bash
VITE_BASE=/curl_display/ npm run build
# 把 dist/ 推到 gh-pages 分支即可
```

`vite.config.ts` 已经把 `base` 配置成读 `VITE_BASE` 环境变量；如果部署到自定义域名根目录或 Tauri 桌面壳，留空即可（默认 `/`）。

### 部署到 Vercel / Netlify / 自定义域名

```bash
npm run build      # base = '/'
# 把 dist/ 部署到任意静态托管
```

记得把 `index.html`、`public/robots.txt`、`public/sitemap.xml`、`public/site.webmanifest` 里的 `viile.github.io/curl_display` 替换成你的域名，否则 canonical / hreflang 全部指向原 repo，对 SEO 反而有害。

### 还需要你自己补的静态资产

`public/` 里建议补两个文件（详见 `public/README-assets.md`）：

| 文件 | 尺寸 | 作用 |
|---|---|---|
| `og-cover.png` | 1200×630 | 分享到 Twitter / Slack / 微信时的卡片图 |
| `apple-touch-icon.png` | 180×180 | iOS 添加到主屏 / 浏览器固定标签的图标 |

### 上线后让 Google 主动收录

1. 在 [Google Search Console](https://search.google.com/search-console) 提交你的站点 URL
2. 提交 `https://your-site/sitemap.xml` 给 Search Console 的 Sitemaps
3. （可选）在 [Bing Webmaster Tools](https://www.bing.com/webmasters/) 重复一遍
4. 一周左右 Google 会开始爬，可以用 Search Console 的「URL 检查」工具实时检验 hreflang / structured data 是否正确
