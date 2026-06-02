/**
 * 站点级 SEO 常量。
 *
 * Fork 后请修改：
 *   - SITE_URL          → 你的部署地址（必须末尾不带 /）
 *   - SITE_NAME         → 自定义品牌名
 *   - OG_IMAGE          → 1200×630 的社交分享图（绝对 URL）
 *   - TWITTER_HANDLE    → 推特账号（带 @），无则置空
 *   - REPO_URL / AUTHOR → 仓库 / 作者信息
 *
 * 这些值会被注入 <meta>、JSON-LD、sitemap 等地方。
 */
export const SITE_URL = 'https://viile.github.io/curl_display';
export const SITE_NAME = 'cURL Runner';
export const SITE_SLOGAN = 'Run, format and visualize curl commands locally';
/**
 * 对外公开的代码仓库 URL。源码仓库（viile/curl_display）是私有的，
 * 这里只暴露承载 Release 与 README 的公开 repo，避免外部用户点进去 404。
 */
export const REPO_URL = 'https://github.com/viile/curl_runner';
export const AUTHOR = 'viile';

/** Open Graph 默认图（1200x630 推荐）。可以是相对 path，会拼接到 SITE_URL 前。 */
export const OG_IMAGE = `${SITE_URL}/og-cover.png`;

export const TWITTER_HANDLE = '';

/** 搜索引擎能识别的应用类别（schema.org SoftwareApplication） */
export const APP_CATEGORY = 'DeveloperApplication';

/** 列入 sitemap / hreflang 的语言代码，需与 i18n 中 LocaleKey 子集对齐 */
export const SITEMAP_LOCALES = [
  'en-US',
  'zh-CN',
  'zh-TW',
  'ja-JP',
  'ko-KR',
  'fr-FR',
  'de-DE',
  'es-ES',
  'it-IT',
  'pt-BR',
  'ru-RU',
  'ar-SA',
  'vi-VN',
  'tr-TR',
  'pl-PL',
  'cs-CZ',
  'bg-BG',
  'ro-RO',
  'th-TH',
  'id-ID',
] as const;
