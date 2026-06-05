/**
 * 在系统外部浏览器中打开 URL。
 *
 * - Tauri 桌面壳内：`<a target="_blank">` 不会有任何反应，因为 webview 默认
 *   不允许打开新窗口；必须经由 `tauri-plugin-opener` 通过系统 shell 启动。
 * - 普通浏览器：退回到 `window.open(url, '_blank', 'noopener,noreferrer')`。
 *
 * 调用方应该 `await` 本函数，并把它绑定到 `@click.prevent` 以阻止默认的
 * 锚点行为（在 Tauri 里也避免 webview 试图自己 navigate）。
 */
import { IS_TAURI } from '../composables/useRuntime';

export async function openExternal(url: string): Promise<void> {
  if (!url) return;
  if (IS_TAURI) {
    try {
      const { openUrl } = await import('@tauri-apps/plugin-opener');
      await openUrl(url);
      return;
    } catch (e) {
      // 插件不可用 → 兜底用 window.open（多数情况下仍会被 Tauri 拦截，
      // 但至少不会静默失败）
      // eslint-disable-next-line no-console
      console.warn('[openExternal] tauri opener failed, fallback to window.open', e);
    }
  }
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    // 极端情况下（例如某些嵌入式 webview）连 window.open 都没有，
    // 退到直接 location 跳转，至少能打开。
    window.location.href = url;
  }
}
