/**
 * 跟随 i18n locale 变化动态更新文档级 SEO 标签。
 *
 * 静态层（index.html 内的 <meta>）解决"首屏被爬虫拿到"的问题，
 * 这个 composable 解决"用户切换语言后，运行时 meta 也跟着变"的问题。
 *
 * 会更新：
 *   - <title>
 *   - <meta name="description">
 *   - <meta name="keywords">
 *   - <meta property="og:title|og:description|og:locale">
 *   - <meta name="twitter:title|twitter:description">
 *
 * <html lang> 与 <html dir> 已在 i18n/index.ts 内由 applyDocAttrs 处理，这里不重复。
 */
import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { currentLocale } from '../i18n';
import { SITE_NAME } from '../config/seo';

/** og:locale 用下划线（en_US），与 i18n 的连字符不同 */
function toOgLocale(locale: string): string {
  return locale.replace('-', '_');
}

function setMeta(
  selector: string,
  attr: 'content',
  value: string,
  create?: { name?: string; property?: string }
) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el && create) {
    el = document.createElement('meta');
    if (create.name) el.setAttribute('name', create.name);
    if (create.property) el.setAttribute('property', create.property);
    document.head.appendChild(el);
  }
  if (el) el.setAttribute(attr, value);
}

export function useSeo() {
  const { t } = useI18n();

  watchEffect(() => {
    const locale = currentLocale.value;
    const appTitle = t('app.title');
    const appSubtitle = t('app.subtitle');
    const description = t('meta.description');
    const keywords = t('meta.keywords');

    const composedTitle = `${appTitle} · ${appSubtitle}`;
    document.title = composedTitle;

    setMeta('meta[name="description"]', 'content', description, { name: 'description' });
    setMeta('meta[name="keywords"]', 'content', keywords, { name: 'keywords' });
    setMeta('meta[name="application-name"]', 'content', SITE_NAME, {
      name: 'application-name',
    });

    setMeta('meta[property="og:title"]', 'content', composedTitle, {
      property: 'og:title',
    });
    setMeta('meta[property="og:description"]', 'content', description, {
      property: 'og:description',
    });
    setMeta('meta[property="og:locale"]', 'content', toOgLocale(locale), {
      property: 'og:locale',
    });
    setMeta('meta[property="og:site_name"]', 'content', SITE_NAME, {
      property: 'og:site_name',
    });

    setMeta('meta[name="twitter:title"]', 'content', composedTitle, {
      name: 'twitter:title',
    });
    setMeta('meta[name="twitter:description"]', 'content', description, {
      name: 'twitter:description',
    });
  });
}
