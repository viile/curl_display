# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · **Français** · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Une application de bureau respectueuse de la vie privée pour coller, formater et exécuter des commandes `curl` en local — sans CORS, sans télémétrie, sans serveur intermédiaire.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#téléchargement)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Téléchargement

Récupérez l'installateur correspondant à votre système depuis la [page Releases](https://github.com/viile/curl_runner/releases/latest).

| OS | Architecture | Fichier |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) ou `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | Autres distributions | `cURL.Runner_*_amd64.AppImage` |

Vous préférez le navigateur ? Essayez la version web : <https://viile.github.io/curl_display/>

La version de bureau prend en charge ce que la sandbox du navigateur interdit :

- Contournement complet du CORS
- En-têtes restreints personnalisés (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (sauter la vérification TLS)
- `-T file:path` (téléverser n'importe quel fichier local)
- L'intégralité de la chaîne de redirections (en-têtes de chaque saut 3xx)

## Au premier lancement

### macOS

L'installateur n'étant pas notarisé par Apple, le premier lancement affiche
*« cURL Runner ne peut pas être ouvert car Apple ne peut pas le vérifier… »*. Au choix :

1. **Recommandé.** Dans le Finder, **clic droit → Ouvrir**, puis cliquez sur **Ouvrir** dans la boîte de dialogue.
2. Ou dans un terminal :

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Si SmartScreen bloque l'installateur NSIS (`*-setup.exe`) :
**Informations complémentaires → Exécuter quand même**. La variante MSI passe généralement sans alerte.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (toute distribution)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Nécessite le binaire `curl` système (préinstallé sur quasiment toutes les distributions).

## Fonctionnalités

- Éditeur en deux volets : `curl` à gauche, statut / temps / taille / en-têtes / corps à droite
- Corps JSON en trois vues commutables : **texte coloré · arbre repliable · carte mentale interactive**
- Recherche dans l'arbre JSON avec surlignage et navigation vers les résultats
- Historique d'exécution local (horodatage complet), favoris, « tout effacer sauf les favoris »
- 20 langues d'interface (avec RTL), thème clair / sombre / système
- Raccourcis : `⌘/Ctrl + Entrée` pour exécuter, `⌘/Ctrl + Maj + F` pour formater

## Vie privée

C'est un outil **entièrement local** :

- Chaque requête HTTP est émise par votre machine directement vers le serveur cible — jamais par nous.
- L'historique d'exécution réside uniquement dans le stockage local de l'application ; rien n'est synchronisé dans le cloud.
- Aucune analytique, aucun rapport de crash, aucun SDK tiers.

## Configuration requise

- macOS 11+ / Windows 10+ / distributions Linux courantes
- Le binaire `curl` système (préinstallé sur macOS / Linux ; Windows 10+ fournit `curl.exe`)

## Retours

Un bug ou une suggestion ? Ouvrez une [issue](https://github.com/viile/curl_runner/issues).

## Code source

Le dépôt de code source est privé. Ce dépôt ne contient que le README public et les binaires de release. Pour une licence commerciale ou une collaboration, contactez `@viile` sur GitHub.

## Licence

[MIT](./LICENSE) © 2026 viile
