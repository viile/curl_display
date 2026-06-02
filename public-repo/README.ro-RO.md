# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · **Română** · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> O aplicație desktop prietenoasă cu intimitatea, pentru a lipi, formata și executa comenzi `curl` local — fără CORS, fără telemetrie, fără server intermediar.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#descărcare)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Descărcare

Ia installer-ul potrivit pentru sistemul tău de pe [pagina Releases](https://github.com/viile/curl_runner/releases/latest).

| SO | Arhitectură | Fișier |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) sau `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | alte distribuții | `cURL.Runner_*_amd64.AppImage` |

Preferi browserul? Încearcă versiunea web: <https://viile.github.io/curl_display/>

Versiunea desktop suportă în plus tot ce sandbox-ul browserului interzice:

- Ocolirea completă a CORS
- Setarea liberă a header-elor restricționate (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (ignorarea verificării TLS)
- `-T file:path` (încărcarea oricărui fișier local)
- Întregul lanț de redirecționări cu header-ele fiecărui hop 3xx

## La prima rulare

### macOS

Installer-ul nu este notarizat de Apple, așa că la prima deschidere va apărea
*„cURL Runner nu poate fi deschis pentru că Apple nu îl poate verifica…"*. Alege una:

1. **Recomandat.** În Finder, **click dreapta → Deschide**, apoi apasă **Deschide** în dialog.
2. Sau în Terminal:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Dacă SmartScreen blochează installer-ul NSIS (`*-setup.exe`):
**Mai multe informații → Rulează oricum**. Varianta MSI trece de regulă fără avertismente.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (orice distribuție)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Necesită binarul `curl` al sistemului (preinstalat practic pe toate distribuțiile).

## Funcționalități

- Editor cu două coloane: `curl` în stânga, status / timp / dimensiune / header / body în dreapta
- Body JSON în trei vizualizări comutabile: **text evidențiat · arbore pliabil · mind-map interactiv**
- Căutare în arborele JSON cu evidențiere live și salt la rezultat
- Istoric local al execuțiilor (cu timestamp complet), favorite și „șterge tot exceptând favoritele"
- 20 de limbi UI (cu RTL), temă deschisă / închisă / sistem
- Scurtături: `⌘/Ctrl + Enter` pentru execuție, `⌘/Ctrl + Shift + F` pentru formatare

## Confidențialitate

Acesta este un instrument **complet local**:

- Fiecare cerere HTTP pleacă de la mașina ta direct spre serverul țintă — niciodată prin noi.
- Istoricul execuțiilor trăiește doar în storage-ul local al aplicației; nimic nu se sincronizează în cloud.
- Fără analytics, fără crash report, fără SDK-uri terțe.

## Cerințe de sistem

- macOS 11+ / Windows 10+ / distribuții Linux uzuale
- Binarul `curl` al sistemului (preinstalat pe macOS / Linux; Windows 10+ vine cu `curl.exe`)

## Feedback

Bug sau cerere de funcționalitate? Deschide un [issue](https://github.com/viile/curl_runner/issues).

## Cod sursă

Depozitul cu codul sursă este privat. Acest depozit găzduiește doar README-ul public și artefactele de release. Pentru licență comercială sau colaborare, contactează `@viile` pe GitHub.

## Licență

[MIT](./LICENSE) © 2026 viile
