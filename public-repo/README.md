<!--
  This README is intended for the PUBLIC release-only repo: viile/curl_runner.
  Do NOT push this file into the private source repo's root.

  See public-repo/SETUP.md for one-time bootstrap steps.
-->

# cURL Runner

**English** · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> A privacy-friendly desktop app to paste, format and run `curl` commands locally — no CORS, no telemetry, no server in between.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#download)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Download

Grab the installer that matches your system from the [Releases page](https://github.com/viile/curl_runner/releases/latest).

| OS | Architecture | File |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) or `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | Other distributions | `cURL.Runner_*_amd64.AppImage` |

Prefer the browser? Try the web version: <https://viile.github.io/curl_display/>

The desktop build additionally supports things the browser sandbox forbids:

- Bypassing CORS entirely
- Custom restricted headers (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (skip TLS)
- `-T file:path` (upload arbitrary local files)
- The full redirect chain headers (every 3xx hop, not just the final response)

## First-run notes

### macOS

The installer is not Apple-notarized, so the first launch shows
*"cURL Runner cannot be opened because Apple cannot check it…"*. Pick one:

1. **Recommended.** In Finder, **right-click → Open**, then click **Open** in the dialog.
2. Or run in Terminal:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

If SmartScreen blocks the NSIS installer (`*-setup.exe`):
**More info → Run anyway**. The MSI variant usually passes silently.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (any distro)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Requires the system `curl` binary (preinstalled on virtually all distros).

## Features

- Side-by-side editor: `curl` on the left, status / time / size / headers / body on the right
- JSON body in three switchable views: **highlighted text · collapsible tree · interactive mind-map**
- Searchable JSON tree with live highlight and jump-to-result
- Local execution history with full timestamps, favoriting, and "clear except favorites"
- 20 UI languages (with RTL), light / dark / system theme
- Shortcuts: `⌘/Ctrl + Enter` to run, `⌘/Ctrl + Shift + F` to format

## Privacy

This is a **fully local** tool.

- Every HTTP request is issued by your machine directly to the target server — never through us.
- Execution history lives only in your local app storage; nothing is synced to the cloud.
- No analytics, no crash reports, no third-party SDKs.

## System Requirements

- macOS 11+ / Windows 10+ / mainstream Linux distributions
- A system `curl` binary (preinstalled on macOS / Linux; Windows 10+ ships `curl.exe`)

## Feedback

Bugs or feature requests? Open an [issue](https://github.com/viile/curl_runner/issues).

## Source

The source repository is private. This repository hosts the public README and signed releases only. For commercial licensing or collaboration, reach out via GitHub `@viile`.

## License

[MIT](./LICENSE) © 2026 viile
