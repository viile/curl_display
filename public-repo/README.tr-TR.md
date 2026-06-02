# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · **Türkçe** · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Gizliliğe önem veren bir masaüstü uygulaması; `curl` komutlarınızı yerel olarak yapıştırın, biçimlendirin ve çalıştırın. CORS yok, telemetri yok, aradaki sunucu yok.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#i̇ndirme)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## İndirme

Sisteminize uygun yükleyiciyi [Releases sayfasından](https://github.com/viile/curl_runner/releases/latest) indirin.

| İşletim Sistemi | Mimari | Dosya |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) veya `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | diğer dağıtımlar | `cURL.Runner_*_amd64.AppImage` |

Tarayıcıyı mı tercih edersiniz? Web sürümünü deneyin: <https://viile.github.io/curl_display/>

Masaüstü sürümü ek olarak tarayıcı sandbox'unun yasakladığı her şeyi destekler:

- CORS'u tamamen aşar
- Kısıtlı başlıkları (`Cookie`, `User-Agent`, `Referer`, …) serbestçe ayarlama
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (TLS doğrulamasını atlama)
- `-T file:path` (herhangi bir yerel dosyayı yükleme)
- Her 3xx adımının başlıklarıyla birlikte tüm yönlendirme zinciri

## İlk açılış notları

### macOS

Yükleyici Apple tarafından notarize edilmediği için ilk açışta
*"cURL Runner açılamıyor, çünkü Apple bunu doğrulayamıyor…"* uyarısı görünür. Birini seçin:

1. **Önerilen.** Finder'da **sağ tık → Aç**, ardından açılan kutuda yine **Aç**.
2. Veya Terminal'de:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

SmartScreen NSIS yükleyiciyi (`*-setup.exe`) engellerse:
**Daha fazla bilgi → Yine de çalıştır**. MSI sürümü genellikle uyarısız geçer.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (herhangi bir dağıtım)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Sistemde `curl` ikilisi gerekir (neredeyse tüm dağıtımlarda önceden kuruludur).

## Özellikler

- Çift panelli editör: solda `curl`, sağda durum / süre / boyut / başlık / gövde
- JSON gövdesi için üç görünüm, anında geçiş: **vurgulu metin · katlanabilir ağaç · etkileşimli zihin haritası**
- JSON ağacında arama, canlı vurgulama ve sonuca atlama
- Yerel yürütme geçmişi (tam zaman damgalı), favoriler ve "favoriler hariç tümünü temizle"
- 20 arayüz dili (RTL dahil), açık / koyu / sisteme uyan tema
- Kısayollar: `⌘/Ctrl + Enter` çalıştırır, `⌘/Ctrl + Shift + F` biçimlendirir

## Gizlilik

Bu **tamamen yerel** çalışan bir araçtır:

- Her HTTP isteği makinenizden doğrudan hedef sunucuya gider — asla bizim üzerimizden değil.
- Yürütme geçmişi yalnızca uygulamanın yerel depolamasında durur; buluta senkronize edilmez.
- Analitik yok, çökme raporu yok, üçüncü taraf SDK yok.

## Sistem Gereksinimleri

- macOS 11+ / Windows 10+ / yaygın Linux dağıtımları
- Sistem `curl` ikilisi (macOS / Linux'ta kuruludur; Windows 10+ `curl.exe` ile gelir)

## Geri Bildirim

Hata veya öneriniz mi var? [Issues](https://github.com/viile/curl_runner/issues) sayfasını kullanın.

## Kaynak Kod

Kaynak kod deposu özeldir. Bu depo yalnızca herkese açık README ve sürüm dosyalarını barındırır. Ticari lisans veya iş birliği için GitHub'da `@viile` ile iletişime geçin.

## Lisans

[MIT](./LICENSE) © 2026 viile
