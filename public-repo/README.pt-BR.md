# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · **Português (BR)** · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Um aplicativo desktop com foco em privacidade para colar, formatar e executar comandos `curl` localmente — sem CORS, sem telemetria, sem servidor no meio.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#download)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Download

Baixe o instalador compatível com seu sistema na [página de Releases](https://github.com/viile/curl_runner/releases/latest).

| SO | Arquitetura | Arquivo |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) ou `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | outras distros | `cURL.Runner_*_amd64.AppImage` |

Prefere o navegador? Use a versão web: <https://viile.github.io/curl_display/>

A versão desktop suporta tudo aquilo que o sandbox do navegador proíbe:

- Driblar totalmente o CORS
- Headers restritos à vontade (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (pular verificação TLS)
- `-T file:path` (enviar qualquer arquivo local)
- A cadeia completa de redirects com os headers de cada hop 3xx

## Observações para a primeira execução

### macOS

O instalador não é notarizado pela Apple, então no primeiro clique aparece
*"cURL Runner não pode ser aberto porque a Apple não pode verificá-lo…"*. Escolha uma:

1. **Recomendado.** No Finder, **clique com o botão direito → Abrir**, depois clique em **Abrir** no diálogo.
2. Ou no Terminal:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Se o SmartScreen bloquear o instalador NSIS (`*-setup.exe`):
**Mais informações → Executar assim mesmo**. A variante MSI geralmente passa sem alertas.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (qualquer distro)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Requer o binário `curl` do sistema (preinstalado em praticamente todas as distros).

## Recursos

- Editor em duas colunas: `curl` à esquerda, status / tempo / tamanho / headers / body à direita
- Body JSON em três visualizações intercambiáveis: **texto destacado · árvore recolhível · mind-map interativo**
- Árvore JSON com busca, destaque ao vivo e salto para o resultado
- Histórico de execução local (com timestamps completos), favoritos e "limpar tudo exceto favoritos"
- 20 idiomas de UI (com RTL), tema claro / escuro / sistema
- Atalhos: `⌘/Ctrl + Enter` para executar, `⌘/Ctrl + Shift + F` para formatar

## Privacidade

Esta é uma ferramenta **totalmente local**:

- Toda requisição HTTP parte da sua máquina diretamente para o servidor de destino — nunca passa por nós.
- O histórico de execução fica apenas no armazenamento local do app; nada é sincronizado para a nuvem.
- Sem analytics, sem relatório de falhas, sem SDKs de terceiros.

## Requisitos de sistema

- macOS 11+ / Windows 10+ / distribuições Linux populares
- Binário `curl` do sistema (preinstalado em macOS / Linux; Windows 10+ vem com `curl.exe`)

## Feedback

Bug ou sugestão? Abra uma [issue](https://github.com/viile/curl_runner/issues).

## Código-fonte

O repositório de código-fonte é privado. Este repositório hospeda apenas o README público e os artefatos de release. Para licenciamento comercial ou parceria, fale com `@viile` no GitHub.

## Licença

[MIT](./LICENSE) © 2026 viile
