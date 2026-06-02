# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · **Español** · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Una aplicación de escritorio respetuosa con la privacidad para pegar, formatear y ejecutar comandos `curl` localmente — sin CORS, sin telemetría, sin servidor de por medio.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#descarga)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Descarga

Consigue el instalador para tu sistema desde la [página de Releases](https://github.com/viile/curl_runner/releases/latest).

| SO | Arquitectura | Archivo |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) o `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | otras distros | `cURL.Runner_*_amd64.AppImage` |

¿Prefieres el navegador? Prueba la versión web: <https://viile.github.io/curl_display/>

La versión de escritorio admite además todo lo que el sandbox del navegador prohíbe:

- Evitar por completo el CORS
- Cabeceras restringidas a tu gusto (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (omitir verificación TLS)
- `-T file:path` (subir cualquier archivo local)
- Toda la cadena de redirecciones con cabeceras de cada salto 3xx

## Notas para la primera ejecución

### macOS

El instalador no está notarizado por Apple, así que la primera vez verás
*"No se puede abrir cURL Runner porque Apple no puede comprobarlo…"*. Elige una opción:

1. **Recomendada.** En Finder, **clic derecho → Abrir** y pulsa **Abrir** en el diálogo.
2. O desde la Terminal:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Si SmartScreen bloquea el instalador NSIS (`*-setup.exe`):
**Más información → Ejecutar de todos modos**. La variante MSI suele pasar sin avisos.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (cualquier distro)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Necesita el binario `curl` del sistema (preinstalado en prácticamente todas las distros).

## Características

- Editor en dos paneles: `curl` a la izquierda, estado / tiempo / tamaño / cabeceras / cuerpo a la derecha
- Cuerpo JSON en tres vistas intercambiables: **texto resaltado · árbol plegable · mapa mental interactivo**
- Búsqueda en el árbol JSON con resaltado en vivo y salto a resultado
- Historial de ejecución local (con timestamps), favoritos y "borrar todo excepto favoritos"
- 20 idiomas de UI (con RTL), tema claro / oscuro / sistema
- Atajos: `⌘/Ctrl + Enter` para ejecutar, `⌘/Ctrl + Mayús + F` para formatear

## Privacidad

Es una herramienta **totalmente local**:

- Cada petición HTTP sale de tu máquina directamente al servidor de destino — nunca pasa por nosotros.
- El historial de ejecución vive únicamente en el almacenamiento local de la app; nada se sincroniza a la nube.
- Sin analítica, sin informes de fallos, sin SDKs de terceros.

## Requisitos del sistema

- macOS 11+ / Windows 10+ / distribuciones Linux comunes
- El binario `curl` del sistema (preinstalado en macOS / Linux; Windows 10+ incluye `curl.exe`)

## Comentarios

¿Bug o sugerencia? Abre una [issue](https://github.com/viile/curl_runner/issues).

## Código fuente

El repositorio de código fuente es privado. Este repositorio solo aloja el README público y los artefactos de release. Para licencia comercial o colaboración, contacta vía GitHub `@viile`.

## Licencia

[MIT](./LICENSE) © 2026 viile
