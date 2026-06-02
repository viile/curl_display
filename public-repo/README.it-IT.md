# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · **Italiano** · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Un'app desktop attenta alla privacy per incollare, formattare ed eseguire comandi `curl` in locale — niente CORS, niente telemetria, nessun server di mezzo.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#download)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Download

Scarica l'installer adatto al tuo sistema dalla [pagina Releases](https://github.com/viile/curl_runner/releases/latest).

| SO | Architettura | File |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) o `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | altre distro | `cURL.Runner_*_amd64.AppImage` |

Preferisci il browser? Prova la versione web: <https://viile.github.io/curl_display/>

La versione desktop supporta in più tutto ciò che il sandbox del browser vieta:

- Aggira completamente CORS
- Header riservati personalizzati (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (salta la verifica TLS)
- `-T file:path` (carica qualsiasi file locale)
- L'intera catena di redirect con gli header di ogni hop 3xx

## Note al primo avvio

### macOS

L'installer non è notarizzato da Apple, quindi al primo avvio compare
*"Impossibile aprire cURL Runner perché Apple non può verificarlo…"*. Scegli uno dei due metodi:

1. **Consigliato.** Nel Finder, **clic destro → Apri**, poi premi **Apri** nella finestra di dialogo.
2. Oppure dal Terminale:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Se SmartScreen blocca l'installer NSIS (`*-setup.exe`):
**Ulteriori informazioni → Esegui comunque**. La variante MSI di solito passa senza avvisi.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (qualunque distro)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Richiede il binario `curl` di sistema (preinstallato praticamente ovunque).

## Funzionalità

- Editor a due colonne: `curl` a sinistra, status / tempo / dimensione / header / body a destra
- Body JSON in tre viste commutabili: **testo evidenziato · albero collassabile · mind-map interattiva**
- Albero JSON con ricerca, evidenziazione live e salto al risultato
- Cronologia di esecuzione locale (con timestamp completo), preferiti, "cancella tutto tranne i preferiti"
- 20 lingue di interfaccia (incluso RTL), tema chiaro / scuro / sistema
- Scorciatoie: `⌘/Ctrl + Invio` per eseguire, `⌘/Ctrl + Shift + F` per formattare

## Privacy

È uno strumento **completamente locale**:

- Ogni richiesta HTTP parte dalla tua macchina direttamente al server di destinazione — mai attraverso noi.
- La cronologia vive solo nello storage locale dell'app; nulla viene sincronizzato sul cloud.
- Niente analytics, niente crash report, niente SDK di terze parti.

## Requisiti di sistema

- macOS 11+ / Windows 10+ / principali distribuzioni Linux
- Il binario `curl` di sistema (preinstallato su macOS / Linux; Windows 10+ include `curl.exe`)

## Feedback

Bug o richieste di funzionalità? Apri una [issue](https://github.com/viile/curl_runner/issues).

## Sorgenti

Il repository sorgente è privato. Questo repository ospita solo il README pubblico e gli artefatti di release. Per licenza commerciale o collaborazione contatta `@viile` su GitHub.

## Licenza

[MIT](./LICENSE) © 2026 viile
