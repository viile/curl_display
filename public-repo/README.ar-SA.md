<div dir="rtl">

# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · [한국어](./README.ko-KR.md) · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · **العربية** · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> تطبيق سطح مكتب يحترم خصوصيتك للصق وتنسيق وتشغيل أوامر `curl` محلياً — بدون CORS، بدون قياسات استخدام، وبدون خادم في المنتصف.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#التنزيل)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## التنزيل

نزّل المثبِّت المناسب لنظامك من [صفحة الإصدارات](https://github.com/viile/curl_runner/releases/latest).

| النظام | المعمارية | الملف |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe` (NSIS) أو `cURL.Runner_*_x64_en-US.msi` (MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | توزيعات أخرى | `cURL.Runner_*_amd64.AppImage` |

تفضّل المتصفح؟ جرّب النسخة الويب: <https://viile.github.io/curl_display/>

نسخة سطح المكتب تدعم إضافياً ما يمنعه sandbox المتصفح:

- تجاوز كامل لقيود CORS
- ضبط حر للهيدرات المقيدة (`Cookie`, `User-Agent`, `Referer`, …)
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (تخطي التحقق من TLS)
- `-T file:path` (رفع أي ملف محلي)
- سلسلة إعادة التوجيه الكاملة مع هيدرات كل قفزة 3xx

## ملاحظات أول تشغيل

### macOS

المثبِّت غير موثّق من Apple، لذلك ستظهر رسالة عند أول تشغيل:
*"تعذّر فتح cURL Runner لأن Apple لا تستطيع التحقق منه…"*. اختر أحد الخيارين:

1. **مستحسن.** في Finder، **انقر بزر الفأرة الأيمن → افتح**، ثم انقر **افتح** في النافذة.
2. أو من Terminal:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

إذا حجب SmartScreen مثبِّت NSIS (`*-setup.exe`):
**مزيد من المعلومات → التشغيل على أي حال**. النسخة MSI عادةً تمرّ دون تحذير.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (أي توزيعة)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

يتطلب وجود ثنائي `curl` في النظام (مثبّت مسبقاً في معظم التوزيعات).

## الميزات

- محرر بعمودين: `curl` على اليسار، الحالة / الزمن / الحجم / الهيدرات / الجسم على اليمين
- جسم JSON بثلاث طرق عرض قابلة للتبديل: **نص مظلَّل · شجرة قابلة للطي · خريطة ذهنية تفاعلية**
- بحث في شجرة JSON مع تظليل لحظي والقفز إلى النتيجة
- سجل تنفيذ محلي (بطوابع زمنية كاملة)، مفضّلات، وخيار «مسح الكل عدا المفضّلات»
- 20 لغة للواجهة (مع دعم RTL)، وضع فاتح / داكن / تابع للنظام
- اختصارات: `⌘/Ctrl + Enter` للتشغيل، `⌘/Ctrl + Shift + F` للتنسيق

## الخصوصية

هذه أداة **محلية بالكامل**:

- كل طلب HTTP يخرج من جهازك مباشرة إلى الخادم الهدف — لا يمر عبرنا أبداً.
- سجل التنفيذ يعيش فقط في التخزين المحلي للتطبيق، ولا يُزامن إلى السحابة.
- لا تحليلات، لا تقارير أعطال، ولا أي SDK طرف ثالث.

## متطلبات النظام

- macOS 11+ / Windows 10+ / توزيعات Linux الرئيسية
- ثنائي `curl` في النظام (مثبّت مسبقاً في macOS / Linux؛ ويأتي `curl.exe` ضمن Windows 10+)

## الملاحظات

عثرت على خطأ أو لديك اقتراح؟ افتح [issue](https://github.com/viile/curl_runner/issues).

## الكود المصدري

مستودع الكود المصدري خاص. هذا المستودع يستضيف فقط الـ README العام وملفات الإصدارات. للترخيص التجاري أو التعاون، تواصل عبر GitHub: `@viile`.

## الترخيص

[MIT](./LICENSE) © 2026 viile

</div>
