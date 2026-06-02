# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · **日本語** · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> `curl` コマンドをローカルで貼り付け・整形・実行できる、プライバシー重視のデスクトップアプリ。CORS 制限なし、テレメトリなし、間に挟まるサーバーなし。

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#ダウンロード)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## ダウンロード

お使いの OS に合ったインストーラを [Releases ページ](https://github.com/viile/curl_runner/releases/latest) から入手してください。

| OS | アーキテクチャ | ファイル |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe`（NSIS）または `cURL.Runner_*_x64_en-US.msi`（MSI） |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | その他 | `cURL.Runner_*_amd64.AppImage` |

ブラウザで使いたい方は Web 版もどうぞ: <https://viile.github.io/curl_display/>

デスクトップ版は、ブラウザサンドボックスでは禁止されている以下の機能をサポートします:

- CORS / クロスオリジン制限を完全に回避
- ブラウザがブロックするヘッダ（`Cookie`, `User-Agent`, `Referer` …）の自由な指定
- `-x/--proxy`, `--cacert/--cert/--key`, `-k`（TLS 検証スキップ）
- `-T file:path`（任意のローカルファイルをアップロード）
- 30x リダイレクトチェーンの全 hop のヘッダ

## 初回起動時の注意

### macOS

Apple の公証を受けていないため、初回はダブルクリックで「Apple では確認できないため開けません」と表示されます。次のいずれかで開いてください:

1. **推奨**: Finder で **右クリック → 開く** → ダイアログで再度「開く」をクリック。
2. もしくはターミナルで:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

NSIS インストーラ（`*-setup.exe`）が SmartScreen にブロックされた場合は **詳細情報 → 実行** を選択してください。MSI 版は通常ブロックされません。

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage（任意のディストリビューション）
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

`curl` バイナリがシステムにインストールされている必要があります（ほぼ全てのディストリビューションでプリインストール済み）。

## 機能

- 左右 2 ペインのレイアウト: 左で `curl` を編集、右でステータス / 時間 / サイズ / ヘッダ / ボディを表示
- JSON ボディを 3 形式で切り替え表示: **シンタックスハイライト · 折りたたみツリー · インタラクティブなマインドマップ**
- JSON ツリービューにはリアルタイム検索 + ハイライト + ジャンプ機能
- ローカルに保存される実行履歴（秒単位）、お気に入り機能、「お気に入り以外をクリア」
- 20 言語の UI（RTL 対応）、ライト / ダーク / システム連動テーマ
- ショートカット: `⌘/Ctrl + Enter` で実行、`⌘/Ctrl + Shift + F` で整形

## プライバシー

これは **完全にローカルで動作する** ツールです:

- HTTP リクエストはあなたのマシンから直接ターゲットサーバーへ発行されます。我々や中継サーバーを経由しません。
- 実行履歴はあなたのローカルストレージにのみ保存され、クラウドには同期されません。
- 計測・クラッシュレポート・第三者 SDK は一切ありません。

## システム要件

- macOS 11+ / Windows 10+ / 主要な Linux ディストリビューション
- システムに `curl` バイナリ（macOS / Linux はプリインストール済み、Windows 10+ には `curl.exe` 同梱）

## フィードバック

バグや機能要望は [Issues](https://github.com/viile/curl_runner/issues) までお願いします。

## ソースコード

ソースコードリポジトリはプライベートです。このリポジトリは公開 README とリリース成果物のみをホストします。商用ライセンスや協業については GitHub `@viile` までご連絡ください。

## ライセンス

[MIT](./LICENSE) © 2026 viile
