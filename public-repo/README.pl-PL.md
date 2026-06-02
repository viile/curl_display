# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · **Polski** · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Aplikacja desktopowa dbająca o prywatność — wklejaj, formatuj i uruchamiaj polecenia `curl` lokalnie. Bez CORS, bez telemetrii, bez serwera pośredniego.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#pobieranie)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Pobieranie

Pobierz instalator pasujący do twojego systemu ze [strony Releases](https://github.com/viile/curl_runner/releases/latest).

| System | Architektura | Plik |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) lub `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | inne dystrybucje | `cURL.Runner_*_amd64.AppImage` |

Wolisz przeglądarkę? Wypróbuj wersję webową: <https://viile.github.io/curl_display/>

Wersja desktopowa obsługuje dodatkowo wszystko, czego zabrania piaskownica przeglądarki:

- Pełne obejście CORS
- Dowolne ustawianie nagłówków ograniczonych (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (pominięcie weryfikacji TLS)
- `-T file:path` (wysyłanie dowolnych plików lokalnych)
- Pełny łańcuch przekierowań wraz z nagłówkami każdego skoku 3xx

## Pierwsze uruchomienie

### macOS

Instalator nie jest notaryzowany przez Apple, więc przy pierwszym uruchomieniu pojawi się
*„Nie można otworzyć aplikacji cURL Runner, ponieważ Apple nie może jej zweryfikować…"*. Wybierz jedną z opcji:

1. **Zalecana.** W Finderze **prawy przycisk → Otwórz** i kliknij **Otwórz** w dialogu.
2. Lub w Terminalu:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Jeśli SmartScreen blokuje instalator NSIS (`*-setup.exe`):
**Więcej informacji → Uruchom mimo to**. Wariant MSI zwykle przechodzi bez ostrzeżeń.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (dowolna dystrybucja)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Wymaga binarki `curl` w systemie (preinstalowana na prawie wszystkich dystrybucjach).

## Funkcje

- Edytor dwukolumnowy: `curl` po lewej, status / czas / rozmiar / nagłówki / treść po prawej
- Treść JSON w trzech przełączanych widokach: **podświetlony tekst · zwijalne drzewo · interaktywna mapa myśli**
- Wyszukiwanie w drzewie JSON z podświetlaniem na żywo i skokiem do wyniku
- Lokalna historia wykonań (z dokładnymi znacznikami czasu), ulubione i „wyczyść wszystko oprócz ulubionych"
- 20 języków interfejsu (z RTL), motyw jasny / ciemny / systemowy
- Skróty: `⌘/Ctrl + Enter` uruchamia, `⌘/Ctrl + Shift + F` formatuje

## Prywatność

To narzędzie **w pełni lokalne**:

- Każde żądanie HTTP wychodzi z twojej maszyny bezpośrednio do serwera docelowego — nigdy przez nas.
- Historia wykonań żyje wyłącznie w lokalnej pamięci aplikacji; nic nie jest synchronizowane do chmury.
- Brak analityki, brak raportów o awariach, brak zewnętrznych SDK.

## Wymagania systemowe

- macOS 11+ / Windows 10+ / popularne dystrybucje Linuksa
- Systemowy `curl` (preinstalowany na macOS / Linux; Windows 10+ dostarcza `curl.exe`)

## Opinie

Bug albo prośba o funkcję? Otwórz [issue](https://github.com/viile/curl_runner/issues).

## Kod źródłowy

Repozytorium z kodem źródłowym jest prywatne. To repozytorium hostuje wyłącznie publiczne README i artefakty wydań. W sprawie licencji komercyjnej lub współpracy pisz na GitHubie: `@viile`.

## Licencja

[MIT](./LICENSE) © 2026 viile
