# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · **Български** · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Десктоп приложение, което уважава вашата поверителност — поставяйте, форматирайте и изпълнявайте `curl` команди локално. Без CORS, без телеметрия, без сървър по средата.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#изтегляне)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Изтегляне

Изтеглете инсталатора за вашата система от [страницата Releases](https://github.com/viile/curl_runner/releases/latest).

| ОС | Архитектура | Файл |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) или `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | други дистрибуции | `cURL.Runner_*_amd64.AppImage` |

Предпочитате браузър? Опитайте уеб версията: <https://viile.github.io/curl_display/>

Десктоп версията допълнително поддържа всичко, което браузърният sandbox забранява:

- Пълно заобикаляне на CORS
- Свободно задаване на ограничени хедъри (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (пропускане на TLS проверка)
- `-T file:path` (качване на произволни локални файлове)
- Цялата верига от пренасочвания с хедърите на всеки 3xx скок

## Бележки за първото стартиране

### macOS

Инсталаторът не е нотаризиран от Apple, така че при първото отваряне ще видите
*„cURL Runner не може да бъде отворен, защото Apple не може да го провери…"*. Изберете един от вариантите:

1. **Препоръчително.** Във Finder **десен бутон → Отвори**, после натиснете **Отвори** в диалога.
2. Или в Terminal:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Ако SmartScreen блокира NSIS инсталатора (`*-setup.exe`):
**Повече информация → Изпълни въпреки това**. MSI вариантът обикновено минава без предупреждение.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (всяка дистрибуция)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Изисква системен бинарен файл `curl` (предварително инсталиран в почти всички дистрибуции).

## Функции

- Двупанелен редактор: `curl` отляво, статус / време / размер / хедъри / тяло отдясно
- JSON тяло в три превключваеми изгледа: **подчертан текст · сгъваемо дърво · интерактивна мисловна карта**
- Търсене в JSON дървото с подчертаване на живо и преход към резултат
- Локална история на изпълненията (с точни времеви маркери), любими и „изчисти всичко освен любимите"
- 20 езика на интерфейса (с RTL), светла / тъмна / системна тема
- Бързи клавиши: `⌘/Ctrl + Enter` за изпълнение, `⌘/Ctrl + Shift + F` за форматиране

## Поверителност

Това е **изцяло локален** инструмент:

- Всяка HTTP заявка тръгва от вашата машина директно към целевия сървър — никога през нас.
- Историята на изпълненията живее само в локалното хранилище на приложението; нищо не се синхронизира в облака.
- Без анализи, без crash доклади, без SDK на трети страни.

## Системни изисквания

- macOS 11+ / Windows 10+ / основните Linux дистрибуции
- Системен `curl` бинар (предварително инсталиран на macOS / Linux; Windows 10+ съдържа `curl.exe`)

## Обратна връзка

Открит бъг или идея за функция? Отворете [issue](https://github.com/viile/curl_runner/issues).

## Сорс код

Хранилището със сорс кода е частно. Това хранилище съдържа само публичното README и release артефактите. За търговски лиценз или сътрудничество, пишете на `@viile` в GitHub.

## Лиценз

[MIT](./LICENSE) © 2026 viile
