# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · **Deutsch** · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Eine datenschutzfreundliche Desktop-App zum lokalen Einfügen, Formatieren und Ausführen von `curl`-Befehlen — kein CORS, keine Telemetrie, kein Server dazwischen.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#download)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Download

Hol dir das passende Installationspaket für dein System von der [Releases-Seite](https://github.com/viile/curl_runner/releases/latest).

| Betriebssystem | Architektur | Datei |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) oder `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | andere Distributionen | `cURL.Runner_*_amd64.AppImage` |

Lieber im Browser? Probier die Web-Version: <https://viile.github.io/curl_display/>

Die Desktop-Variante unterstützt zusätzlich, was die Browser-Sandbox verbietet:

- CORS / Cross-Origin-Beschränkungen komplett umgehen
- Eingeschränkte Header frei setzen (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (TLS-Prüfung überspringen)
- `-T file:path` (beliebige lokale Dateien hochladen)
- Vollständige Redirect-Kette mit Headern aller 3xx-Hops

## Hinweise zum ersten Start

### macOS

Das Installationspaket ist nicht Apple-notarisiert. Beim ersten Start erscheint
*„cURL Runner kann nicht geöffnet werden, da Apple es nicht überprüfen kann…"*. Eines davon wählen:

1. **Empfohlen.** Im Finder **Rechtsklick → Öffnen** und im Dialog erneut **Öffnen** anklicken.
2. Oder im Terminal:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Falls SmartScreen das NSIS-Installationspaket (`*-setup.exe`) blockiert:
**Weitere Informationen → Trotzdem ausführen**. Die MSI-Variante läuft meist ohne Warnung durch.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (beliebige Distribution)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Erfordert das System-`curl`-Binary (auf nahezu allen Distributionen vorinstalliert).

## Funktionen

- Zweispalten-Editor: `curl` links bearbeiten, Status / Dauer / Größe / Header / Body rechts anzeigen
- JSON-Body in drei umschaltbaren Ansichten: **hervorgehobener Text · zusammenklappbarer Baum · interaktive Mindmap**
- Durchsuchbarer JSON-Baum mit Live-Highlighting und Sprung zum Treffer
- Lokale Ausführungs-Historie (sekundengenau), Favoriten und „alles außer Favoriten leeren"
- 20 UI-Sprachen (mit RTL), helles / dunkles / Systemthema
- Tastenkürzel: `⌘/Strg + Enter` zum Ausführen, `⌘/Strg + Umschalt + F` zum Formatieren

## Datenschutz

Dies ist ein **vollständig lokales** Werkzeug:

- Jede HTTP-Anfrage geht direkt von deinem Rechner an den Zielserver — niemals über uns.
- Die Ausführungs-Historie bleibt ausschließlich im lokalen App-Speicher und wird nicht in die Cloud synchronisiert.
- Kein Tracking, keine Crash-Reports, keine Drittanbieter-SDKs.

## Systemanforderungen

- macOS 11+ / Windows 10+ / gängige Linux-Distributionen
- Das System-`curl`-Binary (auf macOS / Linux vorinstalliert; Windows 10+ liefert `curl.exe` mit)

## Feedback

Bug gefunden oder Feature-Wunsch? Eröffne eine [Issue](https://github.com/viile/curl_runner/issues).

## Quellcode

Das Quellcode-Repository ist privat. Dieses Repository hostet ausschließlich das öffentliche README und die Release-Artefakte. Für kommerzielle Lizenzen oder Kollaboration: GitHub `@viile`.

## Lizenz

[MIT](./LICENSE) © 2026 viile
