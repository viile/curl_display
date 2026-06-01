/**
 * 桌面应用下载页 URL。
 *
 * 默认指向当前仓库的 GitHub Releases。GitHub Actions workflow
 * (.github/workflows/release.yml) 会在打 tag 时自动构建并上传
 * macOS (.dmg) / Windows (.exe/.msi) / Linux (.AppImage/.deb) 资产。
 *
 * 如果你 fork 后用自己的 repo，改这里即可。
 */
export const DESKTOP_DOWNLOAD_URL =
  'https://github.com/viile/curl_display/releases/latest';
