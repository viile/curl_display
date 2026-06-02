# cURL Runner

[English](./README.md) · **简体中文** · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> 一个本地运行 `curl` 命令的桌面应用：粘贴、格式化、执行、可视化结果。无 CORS 限制，所有请求都在你本机直接发出，不经任何第三方服务器、无埋点。

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#下载)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## 下载

到 [Releases 页面](https://github.com/viile/curl_runner/releases/latest) 挑选匹配你系统的安装包。

| 操作系统 | 架构 | 文件 |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe`（NSIS）或 `cURL.Runner_*_x64_en-US.msi`（MSI） |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | 其他发行版 | `cURL.Runner_*_amd64.AppImage` |

不想装客户端，可以直接用 Web 版：<https://viile.github.io/curl_display/>

桌面版相比 Web 版额外支持的能力（浏览器沙箱禁止的）：

- 无 CORS / 跨域限制
- 自定义浏览器禁用的请求头：`Cookie`、`User-Agent`、`Referer` 等
- `-x/--proxy`、`--cacert/--cert/--key`、`-k`（跳过 TLS 校验）
- `-T file:path`（上传任意本地文件）
- 完整的 30x 跳转链 header（而非只看最终响应）

## 首次启动说明

### macOS

安装包未做 Apple 公证，首次双击会提示「无法打开，因为 Apple 无法验证」。任选其一放行：

1. **推荐做法**：在 Finder 里**右键 → 打开**，弹窗里再点一次「打开」即可。
2. 或在终端执行：

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

如果 NSIS 安装包（`*-setup.exe`）被 SmartScreen 拦截：**更多信息 → 仍要运行**。MSI 版本通常不会触发拦截。

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage（任意发行版）
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

需要本机已安装 `curl` 二进制（绝大多数发行版自带）。

## 功能

- 左右分栏：左边编辑 `curl`，右边展示状态码 / 耗时 / 大小 / 响应头 / 响应体
- JSON 响应体三种视图，一键切换：**高亮文本 · 可折叠树 · 交互式脑图**
- JSON 树形视图支持搜索、高亮、跳转
- 本地执行历史（精确到秒），支持收藏、「清空时保留收藏」
- 20 种 UI 语言（含 RTL），浅色 / 深色 / 跟随系统主题
- 快捷键：`⌘/Ctrl + Enter` 执行，`⌘/Ctrl + Shift + F` 格式化

## 隐私

这是一个**纯本地工具**：

- 所有 HTTP 请求都由你的机器直接发往目标服务器，不经过我们或任何中间服务。
- 执行历史只存在本地，从不同步上云。
- 无埋点、无错误上报、无任何第三方 SDK。

## 系统要求

- macOS 11+ / Windows 10+ / 主流 Linux 发行版
- 本机已安装 `curl` 二进制（macOS / Linux 默认有；Windows 10+ 自带 `curl.exe`）

## 反馈

发现 bug 或想提需求？欢迎到 [Issues](https://github.com/viile/curl_runner/issues) 反馈。

## 源码

源码仓库为私有，本仓库只承载公开 README 与发布产物。若有商业授权或代码合作需求，请通过 GitHub `@viile` 联系。

## 协议

[MIT](./LICENSE) © 2026 viile
