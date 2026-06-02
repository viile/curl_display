# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · **ไทย** · [Bahasa Indonesia](./README.id-ID.md)

> แอปเดสก์ท็อปที่ให้คุณวาง, จัดรูปแบบ และรันคำสั่ง `curl` ในเครื่องของคุณ — ไม่มี CORS, ไม่มี telemetry, ไม่มีเซิร์ฟเวอร์คั่นกลาง

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#ดาวนโหลด)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## ดาวน์โหลด

ดาวน์โหลดตัวติดตั้งที่ตรงกับระบบของคุณจาก [หน้า Releases](https://github.com/viile/curl_runner/releases/latest)

| OS | สถาปัตยกรรม | ไฟล์ |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) หรือ `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | ดิสโทรอื่น ๆ | `cURL.Runner_*_amd64.AppImage` |

ถ้าไม่อยากติดตั้ง สามารถใช้เวอร์ชันเว็บได้: <https://viile.github.io/curl_display/>

เวอร์ชันเดสก์ท็อปรองรับสิ่งที่ sandbox ของเบราว์เซอร์ห้ามไว้เพิ่มเติม:

- ไม่มีข้อจำกัด CORS / cross-origin ใด ๆ
- กำหนด header ที่เบราว์เซอร์บล็อกได้ (`Cookie`, `User-Agent`, `Referer` ฯลฯ)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (ข้ามการตรวจ TLS)
- `-T file:path` (อัปโหลดไฟล์ใด ๆ บนเครื่อง)
- header ของ redirect chain แบบเต็ม (ทุก hop ของ 3xx)

## ข้อแนะนำเมื่อเปิดครั้งแรก

### macOS

ตัวติดตั้งไม่ได้ผ่าน notarize ของ Apple ครั้งแรกที่ดับเบิลคลิกอาจขึ้นว่า "ไม่สามารถเปิดได้ เนื่องจาก Apple ไม่สามารถตรวจสอบได้…" ใช้วิธีใดวิธีหนึ่ง:

1. **แนะนำ**: ใน Finder ให้ **คลิกขวา → Open** แล้วกด **Open** ในกล่องโต้ตอบอีกครั้ง
2. หรือรันใน Terminal:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

ถ้า SmartScreen บล็อกตัวติดตั้ง NSIS (`*-setup.exe`): **More info → Run anyway** เวอร์ชัน MSI มักจะผ่านได้โดยไม่มีปัญหา

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (ดิสโทรใดก็ได้)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

ต้องมีไบนารี `curl` บนเครื่อง (ติดตั้งมาให้แล้วในเกือบทุกดิสโทร)

## คุณสมบัติ

- เลย์เอาต์สองคอลัมน์: แก้ไข `curl` ทางซ้าย, แสดงสถานะ / เวลา / ขนาด / header / body ทางขวา
- JSON body สามรูปแบบ สลับได้ทันที: **ข้อความที่ไฮไลต์ · ทรีพับได้ · มายด์แมปแบบโต้ตอบ**
- ค้นหา ไฮไลต์ และข้ามไปยังผลลัพธ์ใน JSON tree ได้
- ประวัติการรันบันทึกในเครื่อง (ละเอียดถึงวินาที), ติดดาวรายการที่ชอบ, ล้างทั้งหมดยกเว้นที่ติดดาว
- 20 ภาษา UI (รองรับ RTL), ธีมสว่าง / มืด / ตามระบบ
- ทางลัด: `⌘/Ctrl + Enter` เพื่อรัน, `⌘/Ctrl + Shift + F` เพื่อจัดรูปแบบ

## ความเป็นส่วนตัว

แอปนี้ทำงาน **ภายในเครื่องของคุณทั้งหมด**:

- ทุกคำขอ HTTP ถูกส่งจากเครื่องของคุณตรงไปยังเซิร์ฟเวอร์ปลายทาง — ไม่ผ่านเราหรือตัวกลางใด ๆ
- ประวัติการรันถูกเก็บไว้ในที่จัดเก็บของแอปบนเครื่องเท่านั้น ไม่ซิงก์ขึ้น cloud
- ไม่มี analytics, ไม่มี crash report, ไม่มี SDK ของบุคคลที่สาม

## ความต้องการของระบบ

- macOS 11+ / Windows 10+ / Linux ดิสโทรหลัก ๆ
- ไบนารี `curl` บนเครื่อง (มีในตัว macOS / Linux; Windows 10+ มี `curl.exe` มาให้)

## ข้อเสนอแนะ

พบบั๊กหรืออยากเสนอฟีเจอร์? เปิด [Issue](https://github.com/viile/curl_runner/issues) ได้เลย

## ซอร์สโค้ด

ที่เก็บซอร์สโค้ดเป็นแบบส่วนตัว ที่เก็บนี้มีเฉพาะ README สาธารณะและไฟล์รีลีสเท่านั้น สำหรับสัญญาอนุญาตเชิงพาณิชย์หรือความร่วมมือ ติดต่อผ่าน GitHub `@viile`

## ใบอนุญาต

[MIT](./LICENSE) © 2026 viile
