# cURL Runner

[English](./README.md) · [简体中文](./README.zh-CN.md) · [繁體中文](./README.zh-TW.md) · [日本語](./README.ja-JP.md) · **한국어** · [Français](./README.fr-FR.md) · [Deutsch](./README.de-DE.md) · [Español](./README.es-ES.md) · [Italiano](./README.it-IT.md) · [Português (BR)](./README.pt-BR.md) · [Русский](./README.ru-RU.md) · [العربية](./README.ar-SA.md) · [Tiếng Việt](./README.vi-VN.md) · [Türkçe](./README.tr-TR.md) · [Polski](./README.pl-PL.md) · [Čeština](./README.cs-CZ.md) · [Български](./README.bg-BG.md) · [Română](./README.ro-RO.md) · [ไทย](./README.th-TH.md) · [Bahasa Indonesia](./README.id-ID.md)

> `curl` 명령을 로컬에서 붙여넣고 포맷팅하고 실행할 수 있는, 프라이버시 친화적인 데스크톱 앱. CORS 제한 없음, 텔레메트리 없음, 중간 서버 없음.

[![Latest release](https://img.shields.io/github/v/release/viile/curl_runner?display_name=tag&style=flat-square)](https://github.com/viile/curl_runner/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/viile/curl_runner/total?style=flat-square)](https://github.com/viile/curl_runner/releases)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=flat-square)](#다운로드)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## 다운로드

[Releases 페이지](https://github.com/viile/curl_runner/releases/latest)에서 사용하시는 시스템에 맞는 설치 파일을 받으세요.

| OS | 아키텍처 | 파일 |
|---|---|---|
| macOS | Apple Silicon (M1/M2/M3/M4) | `cURL Runner_*_aarch64.dmg` |
| macOS | Intel | `cURL Runner_*_x64.dmg` |
| Windows | x64 | `cURL.Runner_*_x64-setup.exe`(NSIS) 또는 `cURL.Runner_*_x64_en-US.msi`(MSI) |
| Linux | Debian / Ubuntu | `cURL.Runner_*_amd64.deb` |
| Linux | 기타 배포판 | `cURL.Runner_*_amd64.AppImage` |

브라우저로 사용하시려면 웹 버전을 이용하실 수 있습니다: <https://viile.github.io/curl_display/>

데스크톱 버전은 브라우저 샌드박스에서 금지되는 다음 기능을 추가로 지원합니다:

- CORS / 교차 출처 제한 완전 우회
- 브라우저가 차단하는 헤더 (`Cookie`, `User-Agent`, `Referer` 등) 자유 지정
- `-x/--proxy`, `--cacert/--cert/--key`, `-k` (TLS 검증 건너뛰기)
- `-T file:path` (임의의 로컬 파일 업로드)
- 30x 리다이렉트 체인의 모든 hop 헤더

## 첫 실행 안내

### macOS

설치 파일은 Apple 공증을 받지 않았기 때문에 처음 실행하면 "Apple에서 확인할 수 없어 열 수 없습니다…"라고 표시됩니다. 다음 중 하나로 허용하세요:

1. **권장**: Finder에서 **우클릭 → 열기** 후 대화상자에서 다시 **열기**를 클릭.
2. 또는 터미널에서:

   ```bash
   xattr -dr com.apple.quarantine "/Applications/cURL Runner.app"
   ```

### Windows

NSIS 설치 파일(`*-setup.exe`)이 SmartScreen에 차단되면 **추가 정보 → 실행**을 선택하세요. MSI 버전은 보통 그대로 통과합니다.

### Linux

```bash
# Debian / Ubuntu
sudo dpkg -i cURL.Runner_*_amd64.deb && sudo apt -f install

# AppImage (모든 배포판)
chmod +x cURL.Runner_*_amd64.AppImage
./cURL.Runner_*_amd64.AppImage
```

시스템에 `curl` 바이너리가 필요합니다 (대부분의 배포판에 기본 설치됨).

## 기능

- 좌우 분할 편집기: 왼쪽에서 `curl` 편집, 오른쪽에서 상태 코드 / 소요 시간 / 크기 / 헤더 / 응답 본문 표시
- JSON 응답 본문을 세 가지 보기로 전환: **하이라이트된 텍스트 · 접을 수 있는 트리 · 인터랙티브 마인드맵**
- JSON 트리 보기에서 실시간 검색, 하이라이트, 결과로 이동 지원
- 로컬에 저장되는 실행 기록(초 단위), 즐겨찾기, "즐겨찾기 제외 모두 지우기"
- 20개 UI 언어 (RTL 지원), 라이트 / 다크 / 시스템 테마
- 단축키: `⌘/Ctrl + Enter` 실행, `⌘/Ctrl + Shift + F` 포맷팅

## 프라이버시

이 도구는 **완전히 로컬에서 동작**합니다:

- 모든 HTTP 요청은 사용자의 컴퓨터에서 대상 서버로 직접 발송됩니다. 우리나 어떤 중간 서버도 거치지 않습니다.
- 실행 기록은 로컬 앱 저장소에만 저장되며 클라우드와 동기화되지 않습니다.
- 분석, 크래시 리포트, 타사 SDK가 일절 없습니다.

## 시스템 요구사항

- macOS 11+ / Windows 10+ / 주요 Linux 배포판
- 시스템에 `curl` 바이너리 (macOS / Linux 기본 포함, Windows 10+에는 `curl.exe` 포함)

## 피드백

버그나 기능 요청은 [Issues](https://github.com/viile/curl_runner/issues)에 남겨주세요.

## 소스 코드

소스 코드 저장소는 비공개입니다. 이 저장소는 공개 README와 릴리스 산출물만 호스팅합니다. 상업적 라이선스나 협업 문의는 GitHub `@viile`으로 연락해 주세요.

## 라이선스

[MIT](./LICENSE) © 2026 viile
