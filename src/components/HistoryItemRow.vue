<script setup lang="ts">
/**
 * 历史记录里一条 item 的可视内容（method / status / url + 收藏/删除按钮 + 时间行）。
 *
 * 单独抽出的原因：HistoryMenu 经过 host → path → items 两层折叠后，会在三种位置渲染
 * 同样的行（flat host、flat path、path children），抽成子组件避免在模板里重复 3 次。
 *
 * 该组件本身不挂 `<button>` 外壳，由父组件包裹一层可点击的 `<button class="history-item">`，
 * 这样父组件可以决定 active / favorite 高亮、并把整行作为 picker 按钮处理。
 */
import { useI18n } from 'vue-i18n';
import { Close, Star, StarFilled } from '@element-plus/icons-vue';
import type { HistoryItem } from '../composables/useHistory';
import { extractCurlSummary } from '../utils/curl';
import { currentLocale } from '../i18n';

const props = defineProps<{
  item: HistoryItem;
}>();

const emit = defineEmits<{
  (e: 'remove', item: HistoryItem, evt: Event): void;
  (e: 'toggle-favorite', item: HistoryItem, evt: Event): void;
}>();

const { t } = useI18n();

function summarize(cmd: string) {
  return extractCurlSummary(cmd);
}

function statusTone(code: number | null | undefined): string {
  if (!code) return 'unknown';
  if (code >= 200 && code < 300) return 'ok';
  if (code >= 300 && code < 400) return 'redirect';
  if (code >= 400 && code < 500) return 'warn';
  return 'err';
}

function methodTone(method: string): string {
  const m = method.toUpperCase();
  if (m === 'GET') return 'get';
  if (m === 'POST') return 'post';
  if (m === 'PUT' || m === 'PATCH') return 'put';
  if (m === 'DELETE') return 'del';
  return 'other';
}

/** 只展示 URL 的 path（含 query/hash），主面板里看接口名最直观；完整 URL 走 :title hover */
function urlPath(url: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    return (u.pathname || '/') + u.search + u.hash;
  } catch {
    const m = url.match(/^[a-zA-Z][\w+.-]*:\/\/[^/]*(\/.*)?$/);
    if (m) return m[1] || '/';
    return url;
  }
}

function timeAgo(ts: number): string {
  const diffSec = Math.round((ts - Date.now()) / 1000);
  try {
    const rtf = new Intl.RelativeTimeFormat(currentLocale.value, { numeric: 'auto' });
    const abs = Math.abs(diffSec);
    if (abs < 60) return rtf.format(diffSec, 'second');
    const diffMin = Math.round(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    const diffHour = Math.round(diffMin / 60);
    if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
    const diffDay = Math.round(diffHour / 24);
    if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');
    const diffMonth = Math.round(diffDay / 30);
    if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month');
    return rtf.format(Math.round(diffMonth / 12), 'year');
  } catch {
    return new Date(ts).toLocaleString();
  }
}

function formatExecTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  try {
    if (sameDay) {
      return new Intl.DateTimeFormat(currentLocale.value, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(d);
    }
    return new Intl.DateTimeFormat(currentLocale.value, {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

function formatExecTimeFull(ts: number): string {
  let full: string;
  try {
    full = new Intl.DateTimeFormat(currentLocale.value, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(ts));
  } catch {
    full = new Date(ts).toLocaleString();
  }
  return `${full} · ${timeAgo(ts)}`;
}
</script>

<template>
  <div class="row-top">
    <span
      class="method"
      :class="`method-${methodTone(summarize(props.item.command).method)}`"
    >
      {{ summarize(props.item.command).method || 'GET' }}
    </span>
    <span
      v-if="props.item.result?.statusCode"
      class="status-pill"
      :class="`tone-${statusTone(props.item.result.statusCode)}`"
    >
      {{ props.item.result.statusCode }}
    </span>
    <span v-else-if="props.item.result?.error" class="status-pill tone-err">
      ERR
    </span>
    <span class="url-text" :title="summarize(props.item.command).url">
      {{ urlPath(summarize(props.item.command).url) || t('history.untitled') }}
    </span>
    <button
      type="button"
      class="fav-btn"
      :class="{ 'is-fav': props.item.favorite }"
      :title="props.item.favorite ? t('history.unfavorite') : t('history.favorite')"
      :aria-label="props.item.favorite ? t('history.unfavorite') : t('history.favorite')"
      :aria-pressed="!!props.item.favorite"
      @click="emit('toggle-favorite', props.item, $event)"
    >
      <el-icon>
        <StarFilled v-if="props.item.favorite" />
        <Star v-else />
      </el-icon>
    </button>
    <button
      type="button"
      class="del-btn"
      :title="t('history.remove')"
      @click="emit('remove', props.item, $event)"
    >
      <el-icon><Close /></el-icon>
    </button>
  </div>
  <div class="row-bot">
    <time
      class="time"
      :datetime="new Date(props.item.timestamp).toISOString()"
      :title="formatExecTimeFull(props.item.timestamp)"
    >
      {{ formatExecTime(props.item.timestamp) }}
    </time>
    <span v-if="props.item.result?.timeMs != null" class="dot">·</span>
    <span v-if="props.item.result?.timeMs != null">
      {{ props.item.result.timeMs }} ms
    </span>
  </div>
</template>

<style scoped>
.row-top {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.row-bot {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  color: var(--text-dim);
  font-size: 11px;
  font-family: var(--mono);
}
.row-bot .time {
  cursor: help;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.2px;
}
.dot {
  opacity: 0.5;
}

.method {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--kbd-bg);
  color: var(--text);
  flex-shrink: 0;
  letter-spacing: 0.5px;
}
.method-get {
  background: rgba(37, 99, 235, 0.16);
  color: var(--tok-key);
}
.method-post {
  background: rgba(14, 168, 132, 0.16);
  color: var(--accent-2);
}
.method-put {
  background: rgba(194, 112, 10, 0.16);
  color: var(--warn);
}
.method-del {
  background: rgba(214, 57, 72, 0.14);
  color: var(--danger);
}
.method-other {
  background: rgba(196, 64, 122, 0.14);
  color: var(--tok-bool);
}

.status-pill {
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}
.tone-ok {
  background: rgba(14, 168, 132, 0.16);
  color: var(--accent-2);
}
.tone-redirect {
  background: rgba(37, 99, 235, 0.16);
  color: var(--tok-key);
}
.tone-warn {
  background: rgba(194, 112, 10, 0.16);
  color: var(--warn);
}
.tone-err {
  background: rgba(214, 57, 72, 0.14);
  color: var(--danger);
}

.url-text {
  flex: 1;
  min-width: 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fav-btn,
.del-btn {
  width: 22px;
  height: 22px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  transition: opacity 0.12s, color 0.12s, background 0.12s, transform 0.06s;
}

.fav-btn {
  color: var(--text-mute);
  opacity: 0.45;
  font-size: 14px;
}
.fav-btn.is-fav {
  color: #f5b94a;
  opacity: 1;
}
.fav-btn:hover {
  color: #f5b94a;
  background: rgba(245, 185, 74, 0.16);
}
.fav-btn:active {
  transform: scale(0.92);
}

.del-btn {
  color: var(--text-dim);
  opacity: 0;
}
.del-btn:hover {
  color: var(--danger);
  background: rgba(214, 57, 72, 0.12);
}
</style>
