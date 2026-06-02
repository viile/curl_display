# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · **Bahasa Indonesia**

> Aplikasi desktop yang ramah privasi untuk menempel, memformat, dan menjalankan perintah `curl` secara lokal — tanpa CORS, tanpa telemetri, tanpa server perantara.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#unduh)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Unduh

Ambil installer yang sesuai sistem Anda dari [halaman Releases](https://github.com/viile/curl_runner/releases/latest).

| OS | Arsitektur | File |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) atau `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | distribusi lain | `cURL.Runner_*_amd64.AppImage` |

Lebih suka browser? Coba versi web: <https://viile.github.io/curl_display/>

Versi desktop juga mendukung semua yang dilarang oleh sandbox browser:

- Melewati CORS sepenuhnya
- Mengatur header terbatas secara bebas (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (melewati verifikasi TLS)
- `-T file:path` (mengunggah file lokal apa pun)
- Seluruh rantai redirect beserta header tiap hop 3xx

## Catatan saat pertama dijalankan

### macOS

Installer belum dinotarisasi Apple, jadi saat pertama dibuka akan muncul
*"cURL Runner tidak dapat dibuka karena Apple tidak dapat memeriksanya…"*. Pilih salah satu:

1. **Disarankan.** Di Finder, **klik kanan → Open**, lalu klik **Open** lagi pada dialog.
2. Atau lewat Terminal:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Jika SmartScreen memblokir installer NSIS (`*-setup.exe`):
**More info → Run anyway**. Varian MSI biasanya lolos tanpa peringatan.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (distribusi apa pun)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Memerlukan binary `curl` di sistem (terpasang di hampir semua distribusi).

## Fitur

- Editor dua kolom: `curl` di kiri, status / waktu / ukuran / header / body di kanan
- Body JSON dengan tiga tampilan yang bisa diganti: **teks ber-highlight · pohon yang bisa dilipat · mind-map interaktif**
- Pencarian pada pohon JSON dengan highlight langsung dan lompat ke hasil
- Riwayat eksekusi lokal (dengan timestamp lengkap), favorit, dan "hapus semua kecuali favorit"
- 20 bahasa UI (termasuk RTL), tema terang / gelap / mengikuti sistem
- Pintasan: `⌘/Ctrl + Enter` untuk menjalankan, `⌘/Ctrl + Shift + F` untuk memformat

## Privasi

Ini adalah alat yang **sepenuhnya lokal**:

- Setiap request HTTP dikirim langsung dari mesin Anda ke server tujuan — tidak pernah melalui kami.
- Riwayat eksekusi hanya tersimpan di penyimpanan lokal aplikasi; tidak ada yang disinkron ke cloud.
- Tanpa analitik, tanpa crash report, tanpa SDK pihak ketiga.

## Kebutuhan sistem

- macOS 11+ / Windows 10+ / distribusi Linux umum
- Binary `curl` di sistem (sudah ada di macOS / Linux; Windows 10+ menyertakan `curl.exe`)

## Umpan balik

Menemukan bug atau punya saran? Buka [Issue](https://github.com/viile/curl_runner/issues).

## Kode sumber

Repository kode sumber bersifat privat. Repository ini hanya menampung README publik dan artefak rilis. Untuk lisensi komersial atau kerja sama, hubungi melalui GitHub `@viile`.

## Lisensi

[MIT](./LICENSE) © 2026 viile
