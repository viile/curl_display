import { computed, ref } from 'vue';
import { createI18n } from 'vue-i18n';

// 应用文案
import zhCN from './locales/zh-CN';
import zhTW from './locales/zh-TW';
import enUS from './locales/en-US';
import jaJP from './locales/ja-JP';
import koKR from './locales/ko-KR';
import frFR from './locales/fr-FR';
import deDE from './locales/de-DE';
import esES from './locales/es-ES';
import itIT from './locales/it-IT';
import ptBR from './locales/pt-BR';
import ruRU from './locales/ru-RU';
import arSA from './locales/ar-SA';
import viVN from './locales/vi-VN';
import trTR from './locales/tr-TR';
import plPL from './locales/pl-PL';
import csCZ from './locales/cs-CZ';
import bgBG from './locales/bg-BG';
import roRO from './locales/ro-RO';
import thTH from './locales/th-TH';
import idID from './locales/id-ID';

// Element Plus 内置 locale
import elZhCN from 'element-plus/es/locale/lang/zh-cn';
import elZhTW from 'element-plus/es/locale/lang/zh-tw';
import elEnUS from 'element-plus/es/locale/lang/en';
import elJaJP from 'element-plus/es/locale/lang/ja';
import elKoKR from 'element-plus/es/locale/lang/ko';
import elFrFR from 'element-plus/es/locale/lang/fr';
import elDeDE from 'element-plus/es/locale/lang/de';
import elEsES from 'element-plus/es/locale/lang/es';
import elItIT from 'element-plus/es/locale/lang/it';
import elPtBR from 'element-plus/es/locale/lang/pt-br';
import elRuRU from 'element-plus/es/locale/lang/ru';
import elArSA from 'element-plus/es/locale/lang/ar';
import elViVN from 'element-plus/es/locale/lang/vi';
import elTrTR from 'element-plus/es/locale/lang/tr';
import elPlPL from 'element-plus/es/locale/lang/pl';
import elCsCZ from 'element-plus/es/locale/lang/cs';
import elBgBG from 'element-plus/es/locale/lang/bg';
import elRoRO from 'element-plus/es/locale/lang/ro';
import elThTH from 'element-plus/es/locale/lang/th';
import elIdID from 'element-plus/es/locale/lang/id';
import type { Language as ElLanguage } from 'element-plus/es/locale';

export type LocaleKey =
  | 'zh-CN'
  | 'zh-TW'
  | 'en-US'
  | 'ja-JP'
  | 'ko-KR'
  | 'fr-FR'
  | 'de-DE'
  | 'es-ES'
  | 'it-IT'
  | 'pt-BR'
  | 'ru-RU'
  | 'ar-SA'
  | 'vi-VN'
  | 'tr-TR'
  | 'pl-PL'
  | 'cs-CZ'
  | 'bg-BG'
  | 'ro-RO'
  | 'th-TH'
  | 'id-ID';

export interface LocaleOption {
  key: LocaleKey;
  /** 母语显示名（菜单主标题） */
  nativeName: string;
  /** 英文名（搜索 / 副标题） */
  englishName: string;
  /** 触发器短标签 */
  short: string;
  flag: string;
  rtl?: boolean;
  elementLocale: ElLanguage;
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { key: 'zh-CN', nativeName: '简体中文', englishName: 'Simplified Chinese', short: '简中', flag: '🇨🇳', elementLocale: elZhCN },
  { key: 'zh-TW', nativeName: '繁體中文', englishName: 'Traditional Chinese', short: '繁中', flag: '🇹🇼', elementLocale: elZhTW },
  { key: 'en-US', nativeName: 'English', englishName: 'English', short: 'EN', flag: '🇺🇸', elementLocale: elEnUS },
  { key: 'ja-JP', nativeName: '日本語', englishName: 'Japanese', short: '日', flag: '🇯🇵', elementLocale: elJaJP },
  { key: 'ko-KR', nativeName: '한국어', englishName: 'Korean', short: '한', flag: '🇰🇷', elementLocale: elKoKR },
  { key: 'fr-FR', nativeName: 'Français', englishName: 'French', short: 'FR', flag: '🇫🇷', elementLocale: elFrFR },
  { key: 'de-DE', nativeName: 'Deutsch', englishName: 'German', short: 'DE', flag: '🇩🇪', elementLocale: elDeDE },
  { key: 'es-ES', nativeName: 'Español', englishName: 'Spanish', short: 'ES', flag: '🇪🇸', elementLocale: elEsES },
  { key: 'it-IT', nativeName: 'Italiano', englishName: 'Italian', short: 'IT', flag: '🇮🇹', elementLocale: elItIT },
  { key: 'pt-BR', nativeName: 'Português', englishName: 'Portuguese (Brazil)', short: 'PT', flag: '🇧🇷', elementLocale: elPtBR },
  { key: 'ru-RU', nativeName: 'Русский', englishName: 'Russian', short: 'RU', flag: '🇷🇺', elementLocale: elRuRU },
  { key: 'ar-SA', nativeName: 'العربية', englishName: 'Arabic', short: 'AR', flag: '🇸🇦', rtl: true, elementLocale: elArSA },
  { key: 'vi-VN', nativeName: 'Tiếng Việt', englishName: 'Vietnamese', short: 'VI', flag: '🇻🇳', elementLocale: elViVN },
  { key: 'tr-TR', nativeName: 'Türkçe', englishName: 'Turkish', short: 'TR', flag: '🇹🇷', elementLocale: elTrTR },
  { key: 'pl-PL', nativeName: 'Polski', englishName: 'Polish', short: 'PL', flag: '🇵🇱', elementLocale: elPlPL },
  { key: 'cs-CZ', nativeName: 'Čeština', englishName: 'Czech', short: 'CS', flag: '🇨🇿', elementLocale: elCsCZ },
  { key: 'bg-BG', nativeName: 'Български', englishName: 'Bulgarian', short: 'BG', flag: '🇧🇬', elementLocale: elBgBG },
  { key: 'ro-RO', nativeName: 'Română', englishName: 'Romanian', short: 'RO', flag: '🇷🇴', elementLocale: elRoRO },
  { key: 'th-TH', nativeName: 'ไทย', englishName: 'Thai', short: 'TH', flag: '🇹🇭', elementLocale: elThTH },
  { key: 'id-ID', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian', short: 'ID', flag: '🇮🇩', elementLocale: elIdID },
];

const STORAGE_KEY = 'curl-display:locale';

/** 把任意 BCP-47 风格的语言码尽量匹配到我们的 LocaleKey */
function matchLocale(input: string | undefined | null): LocaleKey | null {
  if (!input) return null;
  const lower = input.toLowerCase().replace('_', '-');
  // 精确命中
  const exact = LOCALE_OPTIONS.find((o) => o.key.toLowerCase() === lower);
  if (exact) return exact.key;
  // 主语言段命中（取我们列表中第一个匹配该主语言的）
  const primary = lower.split('-')[0];
  // 特殊处理：中文区分简繁
  if (primary === 'zh') {
    if (/-tw|-hk|-mo|-hant/.test(lower)) return 'zh-TW';
    return 'zh-CN';
  }
  if (primary === 'pt') return 'pt-BR';
  const byPrimary = LOCALE_OPTIONS.find((o) => o.key.toLowerCase().startsWith(primary + '-'));
  return byPrimary?.key ?? null;
}

function detectInitialLocale(): LocaleKey {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const matched = matchLocale(saved);
    if (matched) return matched;
  } catch {
    /* ignore */
  }
  const candidates: string[] = [];
  if (typeof navigator !== 'undefined') {
    if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages);
    if (navigator.language) candidates.push(navigator.language);
  }
  for (const c of candidates) {
    const m = matchLocale(c);
    if (m) return m;
  }
  return 'en-US';
}

const initial = detectInitialLocale();

/**
 * 自定义 messageCompiler，替代 vue-i18n 内置的严格解析器。
 *
 * - 仅把 `{name}`（name 为合法 JS 标识符）视为占位符
 * - 其它 `{...}`（如 JSON 字面量 `{"a":1}`）按原文输出
 * - 不再支持 vue-i18n 高级特性（linked message `@:`、复数 `|`），项目目前不需要
 *
 * 这样翻译文本里出现 JSON / 数学公式等花括号也不会触发编译错误。
 */
const PLACEHOLDER_RE = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
function messageCompiler(source: unknown): (ctx: any) => string {
  if (typeof source !== 'string') {
    return () => (source == null ? '' : String(source));
  }
  return (ctx: any) =>
    source.replace(PLACEHOLDER_RE, (match: string, key: string) => {
      try {
        const named = ctx?.named?.(key);
        if (named !== undefined && named !== null) return String(named);
      } catch {
        /* ignore */
      }
      return match;
    });
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initial,
  fallbackLocale: 'en-US',
  messageCompiler,
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS,
    'ja-JP': jaJP,
    'ko-KR': koKR,
    'fr-FR': frFR,
    'de-DE': deDE,
    'es-ES': esES,
    'it-IT': itIT,
    'pt-BR': ptBR,
    'ru-RU': ruRU,
    'ar-SA': arSA,
    'vi-VN': viVN,
    'tr-TR': trTR,
    'pl-PL': plPL,
    'cs-CZ': csCZ,
    'bg-BG': bgBG,
    'ro-RO': roRO,
    'th-TH': thTH,
    'id-ID': idID,
  },
});

export const currentLocale = ref<LocaleKey>(initial);

export const currentLocaleOption = computed<LocaleOption>(
  () =>
    LOCALE_OPTIONS.find((o) => o.key === currentLocale.value) ?? LOCALE_OPTIONS[0]
);

export const currentElementLocale = computed<ElLanguage>(
  () => currentLocaleOption.value.elementLocale
);

export const isRTL = computed<boolean>(() => !!currentLocaleOption.value.rtl);

function applyDocAttrs(key: LocaleKey) {
  try {
    const opt = LOCALE_OPTIONS.find((o) => o.key === key);
    document.documentElement.lang = key;
    document.documentElement.dir = opt?.rtl ? 'rtl' : 'ltr';
  } catch {
    /* ignore */
  }
}

export function setLocale(key: LocaleKey) {
  if (!LOCALE_OPTIONS.some((o) => o.key === key)) return;
  currentLocale.value = key;
  (i18n.global.locale as unknown as { value: string }).value = key;
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    /* ignore */
  }
  applyDocAttrs(key);
}

applyDocAttrs(initial);
