# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · **Čeština** · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Desktopová aplikace, která hraje fér k vašemu soukromí — vkládejte, formátujte a spouštějte příkazy `curl` lokálně. Žádné CORS, žádná telemetrie, žádný server mezi vámi a cílem.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#stažení)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Stažení

Stáhněte si instalátor pro váš systém ze [stránky Releases](https://github.com/viile/curl_runner/releases/latest).

| OS | Architektura | Soubor |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) nebo `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | jiné distribuce | `cURL.Runner_*_amd64.AppImage` |

Preferujete prohlížeč? Vyzkoušejte webovou verzi: <https://viile.github.io/curl_display/>

Desktopová verze navíc podporuje vše, co sandbox prohlížeče zakazuje:

- Úplné obejití CORS
- Volné nastavení omezených hlaviček (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (přeskočit ověření TLS)
- `-T file:path` (nahrání libovolného lokálního souboru)
- Kompletní řetězec přesměrování s hlavičkami každého 3xx kroku

## První spuštění

### macOS

Instalátor není notarizovaný Applem, takže při prvním otevření uvidíte
*„cURL Runner nelze otevřít, protože Apple jej nemůže ověřit…"*. Vyberte si:

1. **Doporučeno.** Ve Finderu **klikněte pravým tlačítkem → Otevřít** a v dialogu znovu klikněte na **Otevřít**.
2. Nebo v Terminálu:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Pokud SmartScreen zablokuje NSIS instalátor (`*-setup.exe`):
**Více informací → Přesto spustit**. Varianta MSI obvykle projde bez varování.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (jakákoli distribuce)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Vyžaduje systémový binární soubor `curl` (předinstalovaný prakticky na všech distribucích).

## Funkce

- Dvousloupcový editor: `curl` vlevo, status / čas / velikost / hlavičky / tělo vpravo
- Tělo JSON ve třech přepínatelných pohledech: **zvýrazněný text · sbalitelný strom · interaktivní myšlenková mapa**
- Vyhledávání ve stromu JSON se živým zvýrazněním a skokem na výsledek
- Lokální historie spuštění (s přesnými časovými razítky), oblíbené a „smazat vše kromě oblíbených"
- 20 jazyků UI (včetně RTL), světlý / tmavý / systémový motiv
- Klávesové zkratky: `⌘/Ctrl + Enter` spustí, `⌘/Ctrl + Shift + F` formátuje

## Soukromí

Toto je **plně lokální** nástroj:

- Každý HTTP požadavek odchází z vašeho stroje přímo na cílový server — nikdy přes nás.
- Historie spuštění žije pouze v lokálním úložišti aplikace; nic se nesynchronizuje do cloudu.
- Žádná analytika, žádné crash reporty, žádné SDK třetích stran.

## Systémové požadavky

- macOS 11+ / Windows 10+ / běžné distribuce Linuxu
- Systémový binární soubor `curl` (předinstalovaný na macOS / Linux; Windows 10+ obsahuje `curl.exe`)

## Zpětná vazba

Chyba nebo nápad na funkci? Otevřete [issue](https://github.com/viile/curl_runner/issues).

## Zdrojový kód

Repozitář se zdrojovým kódem je soukromý. Tento repozitář hostuje pouze veřejné README a artefakty vydání. Pro komerční licenci nebo spolupráci pište `@viile` na GitHubu.

## Licence

[MIT](./LICENSE) © 2026 viile
