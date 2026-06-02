# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · **繁體中文** · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> 一個在本機執行 `curl` 命令的桌面應用：貼上、格式化、執行、視覺化呈現結果。完全沒有 CORS 限制，所有請求都從你的電腦直接發出，不經任何第三方伺服器，也沒有任何追蹤。

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#下載)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## 下載

到 [Releases 頁面](https://github.com/viile/curl_runner/releases/latest) 挑選符合你系統的安裝包。

| 作業系統 | 架構 | 檔案 |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe`（NSIS）或 `cURL.Runner_*_x64_en-US.msi`（MSI） |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | 其他發行版 | `cURL.Runner_*_amd64.AppImage` |

不想裝桌面版，也可以直接使用瀏覽器版：<https://viile.github.io/curl_display/>

桌面版相對於瀏覽器版額外支援的能力（瀏覽器沙箱禁止的）：

- 完全沒有 CORS / 跨網域限制
- 可自訂瀏覽器禁用的請求標頭：`Cookie`、`User-Agent`、`Referer` 等
- `-x/--proxy`、`--cacert/--cert/--key`、`-k`（略過 TLS 驗證）
- `-T file:path`（上傳任意本機檔案）
- 完整的 30x 重新導向標頭鏈（而非只能看到最終回應）

## 首次啟動注意事項

### macOS

安裝包未經 Apple 公證，首次點兩下會跳出「無法開啟，因為 Apple 無法驗證」。擇一放行即可：

1. **建議方式**：在 Finder 中**按右鍵 → 打開**，再於對話框中再次點「打開」。
2. 或於終端機執行：

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

若 NSIS 安裝包（`*-setup.exe`）被 SmartScreen 攔截：**其他資訊 → 仍要執行**。MSI 版本通常不會被攔截。

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage（任何發行版）
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

需要本機已安裝 `curl` 執行檔（絕大多數發行版預設都有）。

## 功能

- 左右分欄：左邊編輯 `curl`，右邊呈現狀態碼 / 耗時 / 大小 / 標頭 / 回應主體
- JSON 回應提供三種檢視，一鍵切換：**語法高亮文字 · 可摺疊樹狀 · 互動心智圖**
- JSON 樹狀檢視內建搜尋、即時高亮與快速跳轉
- 本機執行歷史（精準到秒），支援收藏與「清空時保留收藏」
- 20 種介面語言（含 RTL），淺色 / 深色 / 跟隨系統主題
- 快速鍵：`⌘/Ctrl + Enter` 執行、`⌘/Ctrl + Shift + F` 格式化

## 隱私

這是一個**完全本機**的工具：

- 所有 HTTP 請求皆由你的電腦直接發送至目標伺服器，絕不經過我們或任何中介。
- 執行歷史僅儲存於本機，從不同步上雲端。
- 沒有追蹤、沒有錯誤回報、沒有任何第三方 SDK。

## 系統需求

- macOS 11+ / Windows 10+ / 主流 Linux 發行版
- 本機已安裝 `curl` 執行檔（macOS / Linux 預設有；Windows 10+ 內建 `curl.exe`）

## 意見回饋

發現 bug 或想要新功能？歡迎到 [Issues](https://github.com/viile/curl_runner/issues) 提出。

## 原始碼

原始碼倉庫為私有，本倉庫僅承載公開 README 與發布檔案。若有商業授權或合作需求，請透過 GitHub `@viile` 聯繫。

## 授權條款

[MIT](./LICENSE) © 2026 viile
