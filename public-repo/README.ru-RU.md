# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · **Русский** · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Десктоп-приложение с заботой о приватности: вставляйте, форматируйте и выполняйте команды `curl` локально. Никаких CORS, никакой телеметрии, никакого сервера-посредника.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#загрузка)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Загрузка

Скачайте установщик для вашей системы со [страницы Releases](https://github.com/viile/curl_runner/releases/latest).

| ОС | Архитектура | Файл |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) или `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | другие дистрибутивы | `cURL.Runner_*_amd64.AppImage` |

Предпочитаете браузер? Попробуйте веб-версию: <https://viile.github.io/curl_display/>

Десктоп-версия дополнительно поддерживает всё, что запрещено песочнице браузера:

- Полный обход CORS
- Произвольная установка ограниченных заголовков (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (пропустить проверку TLS)
- `-T file:path` (загрузка любых локальных файлов)
- Полная цепочка перенаправлений с заголовками каждого 3xx-перехода

## Первый запуск

### macOS

Установщик не нотаризован Apple, поэтому при первом запуске появится сообщение
*«Не удаётся открыть cURL Runner, потому что Apple не может его проверить…»*. Выберите вариант:

1. **Рекомендуемый.** В Finder — **правый клик → Открыть**, затем в диалоге нажмите **Открыть**.
2. Или в Терминале:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Если SmartScreen блокирует NSIS-установщик (`*-setup.exe`):
**Подробнее → Выполнить в любом случае**. MSI обычно проходит без предупреждений.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (любой дистрибутив)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Требуется бинарь `curl` в системе (предустановлен почти во всех дистрибутивах).

## Возможности

- Двухпанельный редактор: `curl` слева, статус / время / размер / заголовки / тело справа
- Тело JSON в трёх переключаемых режимах: **подсвеченный текст · сворачиваемое дерево · интерактивная mind-map**
- Поиск по JSON-дереву с подсветкой и переходом к результату
- Локальная история выполнения (с точными временными метками), избранное и «очистить всё, кроме избранного»
- 20 языков интерфейса (с RTL), светлая / тёмная / системная тема
- Горячие клавиши: `⌘/Ctrl + Enter` — запуск, `⌘/Ctrl + Shift + F` — форматирование

## Приватность

Это **полностью локальный** инструмент:

- Каждый HTTP-запрос идёт с вашей машины напрямую на целевой сервер — никогда через нас.
- История выполнения хранится только в локальном хранилище приложения и не синхронизируется в облако.
- Никакой аналитики, никаких отчётов о падениях, никаких сторонних SDK.

## Системные требования

- macOS 11+ / Windows 10+ / основные дистрибутивы Linux
- Системный бинарь `curl` (предустановлен на macOS / Linux; Windows 10+ поставляется с `curl.exe`)

## Обратная связь

Нашли баг или хотите новую функцию? Откройте [issue](https://github.com/viile/curl_runner/issues).

## Исходный код

Репозиторий с исходным кодом приватный. Этот репозиторий содержит только публичный README и артефакты релизов. По вопросам коммерческой лицензии или сотрудничества пишите `@viile` на GitHub.

## Лицензия

[MIT](./LICENSE) © 2026 viile
