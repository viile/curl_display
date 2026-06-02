# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · **Tiếng Việt** · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> Một ứng dụng desktop tôn trọng quyền riêng tư — dán, định dạng và chạy lệnh `curl` ngay trên máy bạn. Không CORS, không telemetry, không server trung gian.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#tải-về)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## Tải về

Lấy bộ cài tương ứng với hệ điều hành của bạn từ [trang Releases](https://github.com/viile/curl_runner/releases/latest).

| Hệ điều hành | Kiến trúc | File |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) hoặc `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | bản phân phối khác | `cURL.Runner_*_amd64.AppImage` |

Thích dùng trình duyệt? Hãy thử bản web: <https://viile.github.io/curl_display/>

Bản desktop hỗ trợ thêm mọi thứ mà sandbox của trình duyệt cấm:

- Vượt qua hoàn toàn CORS
- Tự do đặt các header bị hạn chế (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (bỏ qua xác thực TLS)
- `-T file:path` (tải lên bất kỳ file cục bộ nào)
- Toàn bộ chuỗi chuyển hướng với header của mọi hop 3xx

## Ghi chú khi mở lần đầu

### macOS

Bộ cài chưa được Apple notarize, nên lần đầu nhấp đúp sẽ hiện
*"Không thể mở cURL Runner vì Apple không thể kiểm tra…"*. Chọn một cách:

1. **Khuyên dùng.** Trong Finder, **chuột phải → Open**, rồi nhấn **Open** trong hộp thoại.
2. Hoặc trong Terminal:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

Nếu SmartScreen chặn bộ cài NSIS (`*-setup.exe`):
**More info → Run anyway**. Bản MSI thường không bị chặn.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (bất kỳ bản phân phối nào)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

Cần có binary `curl` trên hệ thống (gần như tất cả bản phân phối đều cài sẵn).

## Tính năng

- Trình soạn thảo hai cột: `curl` bên trái, status / thời gian / kích thước / header / body bên phải
- Body JSON ở ba chế độ xem chuyển đổi nhanh: **văn bản tô màu · cây có thể thu gọn · mind-map tương tác**
- Tìm kiếm trong cây JSON với tô sáng trực tiếp và nhảy tới kết quả
- Lịch sử thực thi lưu cục bộ (với mốc thời gian chi tiết), yêu thích và "xóa tất cả trừ yêu thích"
- 20 ngôn ngữ giao diện (có RTL), giao diện sáng / tối / theo hệ thống
- Phím tắt: `⌘/Ctrl + Enter` để chạy, `⌘/Ctrl + Shift + F` để định dạng

## Quyền riêng tư

Đây là một công cụ **chạy hoàn toàn cục bộ**:

- Mọi request HTTP đều đi từ máy bạn thẳng tới server đích — không qua chúng tôi hay bất kỳ trung gian nào.
- Lịch sử thực thi chỉ tồn tại trong bộ nhớ cục bộ của app; không có gì được đồng bộ lên cloud.
- Không analytics, không crash report, không SDK bên thứ ba.

## Yêu cầu hệ thống

- macOS 11+ / Windows 10+ / các bản phân phối Linux phổ biến
- Binary `curl` trên hệ thống (đã có sẵn trên macOS / Linux; Windows 10+ đi kèm `curl.exe`)

## Phản hồi

Gặp bug hay muốn thêm tính năng? Mở [Issue](https://github.com/viile/curl_runner/issues).

## Mã nguồn

Repository mã nguồn là private. Repository này chỉ chứa README công khai và file release. Để có giấy phép thương mại hoặc hợp tác, liên hệ qua GitHub `@viile`.

## Giấy phép

[MIT](./LICENSE) © 2026 viile
