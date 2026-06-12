<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Clock,
  Delete,
  Search,
  Close,
  Star,
  StarFilled,
  ArrowRight,
} from '@element-plus/icons-vue';
import { useHistory, type HistoryItem } from '../composables/useHistory';
import { useConsent } from '../composables/useConsent';
import { extractCurlSummary } from '../utils/curl';
import { currentLocale } from '../i18n';

const props = defineProps<{
  /** 当前命令，用于高亮匹配项 */
  currentCommand: string;
}>();

const emit = defineEmits<{
  (e: 'pick', item: HistoryItem): void;
}>();

const { t } = useI18n();
const { items, count, favoriteCount, remove, toggleFavorite, clear } = useHistory();
const { isAccepted, accept } = useConsent();

const visible = ref(false);
const keyword = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

/** 用户主动展开过的分组（按 path key 记录），search 模式下会无条件展开所有匹配组 */
const expandedKeys = ref<Set<string>>(new Set());

interface HistoryGroup {
  /** 分组键：纯 pathname（去掉 query/hash）。无法解析出 URL 的退化为按 item.id 独立分组 */
  key: string;
  /** 顶层展示用的 path 字符串；无 URL 的退化分组为空 */
  pathDisplay: string;
  /** 组内成员，按 favorite 优先 + 时间倒序 */
  items: HistoryItem[];
  hasFavorite: boolean;
  /** 组内是否包含当前编辑器命中的 activeId */
  hasActive: boolean;
  /** 组内最新 timestamp，用于排序 */
  latestTimestamp: number;
}

const normalizedCurrent = computed(() => props.currentCommand.trim());

/**
 * 同命令多次执行后，列表中可能有多条匹配项；只把最新（最靠前）的一条标记 active，
 * 否则同命令会全部高亮，反而看不出"现在选中的是哪一条"。
 */
const activeId = computed<string | null>(() => {
  const n = normalizedCurrent.value;
  if (!n) return null;
  return items.value.find((i) => i.command.trim() === n)?.id ?? null;
});

const groups = computed<HistoryGroup[]>(() => {
  const q = keyword.value.trim().toLowerCase();
  const base = q
    ? items.value.filter((it) => {
        const s = extractCurlSummary(it.command);
        return (
          it.command.toLowerCase().includes(q) ||
          s.url.toLowerCase().includes(q) ||
          s.method.toLowerCase().includes(q)
        );
      })
    : items.value;

  // 同一 pathname 的多条记录收拢到一组；解析不到 URL 的退化为单条独立组，
  // 避免把所有 "(无 URL)" 的记录混在一起、导致命令彼此盖掉。
  const map = new Map<string, HistoryItem[]>();
  for (const item of base) {
    const s = extractCurlSummary(item.command);
    const path = urlPathname(s.url);
    const key = path || `__no_url__:${item.id}`;
    const arr = map.get(key);
    if (arr) arr.push(item);
    else map.set(key, [item]);
  }

  const list: HistoryGroup[] = [];
  for (const [key, raw] of map) {
    // items.value 已经是 timestamp 倒序，所以 raw 也是。这里再用稳定排序把收藏顶起来。
    const sorted = [...raw].sort(
      (a, b) => Number(!!b.favorite) - Number(!!a.favorite)
    );
    const path = key.startsWith('__no_url__:') ? '' : key;
    list.push({
      key,
      pathDisplay: path,
      items: sorted,
      hasFavorite: sorted.some((i) => i.favorite),
      hasActive: activeId.value
        ? sorted.some((i) => i.id === activeId.value)
        : false,
      latestTimestamp: sorted.reduce((m, i) => Math.max(m, i.timestamp), 0),
    });
  }

  // 组级排序：含收藏的优先、然后按最新一次执行时间倒序
  list.sort((a, b) => {
    if (a.hasFavorite !== b.hasFavorite) {
      return Number(b.hasFavorite) - Number(a.hasFavorite);
    }
    return b.latestTimestamp - a.latestTimestamp;
  });

  return list;
});

/** 当前可见的条目总数（过滤后），用于 footer "X / Y" 展示 */
const visibleCount = computed(() =>
  groups.value.reduce((n, g) => n + g.items.length, 0)
);

/**
 * 是否展开某个分组：
 * - 搜索态：全部展开，方便看到匹配项
 * - 默认：尊重用户的 expandedKeys
 *
 * 注意：单条目分组不会进入这条逻辑（模板里直接渲染为普通行）。
 */
function isExpanded(group: HistoryGroup): boolean {
  if (keyword.value.trim().length > 0) return true;
  return expandedKeys.value.has(group.key);
}

function toggleExpanded(group: HistoryGroup) {
  const next = new Set(expandedKeys.value);
  if (next.has(group.key)) next.delete(group.key);
  else next.add(group.key);
  expandedKeys.value = next;
}

watch(visible, (v) => {
  if (v) {
    nextTick(() => searchInput.value?.focus());
  } else {
    keyword.value = '';
    expandedKeys.value = new Set();
  }
});

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

function summarize(cmd: string) {
  return extractCurlSummary(cmd);
}

/**
 * 列表里只展示请求 URL 的 path（含 query/hash），去掉协议+域名+端口。
 * 这样窄列表里也能看清接口名，悬停时再通过 :title 看完整 URL。
 *
 * - 标准 URL：用 URL API，pathname 为空时退化为 '/'
 * - 解析失败：用正则尝试剥离 `scheme://host[:port]` 前缀；都不行就原样返回。
 */
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

/**
 * 仅提取 URL 的 pathname（不含 query/hash），用作分组键。
 * 这样 `/api/users?id=1` 和 `/api/users?id=2` 会被收拢到 `/api/users` 这一组里。
 */
function urlPathname(url: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.pathname || '/';
  } catch {
    const m = url.match(/^[a-zA-Z][\w+.-]*:\/\/[^/]*(\/[^?#]*)?/);
    if (m) return m[1] || '/';
    return url.split(/[?#]/)[0] || '';
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

/** 列表里展示的执行时间：当天只显示 HH:mm:ss；非当天显示 MM-DD HH:mm */
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

/** hover tooltip 用：完整日期时间 + 相对时间 */
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

function handlePick(item: HistoryItem) {
  emit('pick', item);
  visible.value = false;
}

function handleRemove(item: HistoryItem, e: Event) {
  e.stopPropagation();
  remove(item.id);
}

function handleToggleFavorite(item: HistoryItem, e: Event) {
  e.stopPropagation();
  toggleFavorite(item.id);
}

async function handleClearAll() {
  const message = favoriteCount.value
    ? t('history.confirmClearKeepFav', { count: favoriteCount.value })
    : t('history.confirmClear');
  try {
    await ElMessageBox.confirm(message, t('history.clear'), {
      type: 'warning',
      confirmButtonText: t('history.clear'),
      cancelButtonText: t('consent.decline'),
    });
    clear();
    ElMessage.success(t('history.cleared'));
  } catch {
    /* user cancelled */
  }
}

function handleEnableHistory() {
  accept();
  ElMessage.success(t('history.enabled'));
}
</script>

<template>
  <el-popover
    v-model:visible="visible"
    trigger="click"
    placement="bottom-start"
    :width="380"
    popper-class="history-popover"
    :show-arrow="false"
  >
    <template #reference>
      <el-button :icon="Clock" plain>
        {{ t('history.title') }}
        <span v-if="isAccepted && count" class="count-badge">{{ count }}</span>
      </el-button>
    </template>

    <div class="history-panel" dir="ltr">
      <!-- 未授权状态 -->
      <div v-if="!isAccepted" class="not-accepted">
        <div class="na-title">{{ t('history.disabledTitle') }}</div>
        <div class="na-msg">{{ t('history.disabledMsg') }}</div>
        <el-button size="small" type="primary" @click="handleEnableHistory">
          {{ t('consent.accept') }}
        </el-button>
      </div>

      <!-- 已授权 -->
      <template v-else>
        <div class="search-wrap">
          <el-icon class="search-icon"><Search /></el-icon>
          <input
            ref="searchInput"
            v-model="keyword"
            class="search-input"
            type="text"
            :placeholder="t('history.searchPlaceholder')"
            spellcheck="false"
          />
        </div>

        <div v-if="!items.length" class="empty-tip">{{ t('history.empty') }}</div>
        <div v-else-if="!groups.length" class="empty-tip">{{ t('history.noMatch') }}</div>

        <div v-else class="history-list">
          <template v-for="group in groups" :key="group.key">
            <!-- 单条目组：保持旧的扁平行 UI，直接 pick -->
            <button
              v-if="group.items.length === 1"
              type="button"
              class="history-item"
              :class="{
                active: group.items[0].id === activeId,
                'is-fav': group.items[0].favorite,
              }"
              @click="handlePick(group.items[0])"
            >
              <div class="row-top">
                <span
                  class="method"
                  :class="`method-${methodTone(summarize(group.items[0].command).method)}`"
                >
                  {{ summarize(group.items[0].command).method || 'GET' }}
                </span>
                <span
                  v-if="group.items[0].result?.statusCode"
                  class="status-pill"
                  :class="`tone-${statusTone(group.items[0].result.statusCode)}`"
                >
                  {{ group.items[0].result.statusCode }}
                </span>
                <span v-else-if="group.items[0].result?.error" class="status-pill tone-err">
                  ERR
                </span>
                <span class="url-text" :title="summarize(group.items[0].command).url">
                  {{ urlPath(summarize(group.items[0].command).url) || t('history.untitled') }}
                </span>
                <button
                  type="button"
                  class="fav-btn"
                  :class="{ 'is-fav': group.items[0].favorite }"
                  :title="group.items[0].favorite ? t('history.unfavorite') : t('history.favorite')"
                  :aria-label="group.items[0].favorite ? t('history.unfavorite') : t('history.favorite')"
                  :aria-pressed="!!group.items[0].favorite"
                  @click="handleToggleFavorite(group.items[0], $event)"
                >
                  <el-icon>
                    <StarFilled v-if="group.items[0].favorite" />
                    <Star v-else />
                  </el-icon>
                </button>
                <button
                  type="button"
                  class="del-btn"
                  :title="t('history.remove')"
                  @click="handleRemove(group.items[0], $event)"
                >
                  <el-icon><Close /></el-icon>
                </button>
              </div>
              <div class="row-bot">
                <time
                  class="time"
                  :datetime="new Date(group.items[0].timestamp).toISOString()"
                  :title="formatExecTimeFull(group.items[0].timestamp)"
                >
                  {{ formatExecTime(group.items[0].timestamp) }}
                </time>
                <span v-if="group.items[0].result?.timeMs != null" class="dot">·</span>
                <span v-if="group.items[0].result?.timeMs != null">
                  {{ group.items[0].result.timeMs }} ms
                </span>
              </div>
            </button>

            <!-- 多条目组：渲染为可展开的"二级菜单"父项 -->
            <template v-else>
              <button
                type="button"
                class="history-item group-header"
                :class="{
                  'is-fav': group.hasFavorite,
                  'has-active-child': group.hasActive,
                  'is-expanded': isExpanded(group),
                }"
                :aria-expanded="isExpanded(group)"
                @click="toggleExpanded(group)"
              >
                <div class="row-top">
                  <span
                    class="caret"
                    :class="{ open: isExpanded(group) }"
                    aria-hidden="true"
                  >
                    <el-icon><ArrowRight /></el-icon>
                  </span>
                  <span class="url-text path-text" :title="group.pathDisplay">
                    {{ group.pathDisplay || t('history.untitled') }}
                  </span>
                  <span class="group-count">{{ group.items.length }}</span>
                </div>
              </button>

              <div v-if="isExpanded(group)" class="group-children">
                <button
                  v-for="item in group.items"
                  :key="item.id"
                  type="button"
                  class="history-item child-item"
                  :class="{ active: item.id === activeId, 'is-fav': item.favorite }"
                  @click="handlePick(item)"
                >
                  <div class="row-top">
                    <span
                      class="method"
                      :class="`method-${methodTone(summarize(item.command).method)}`"
                    >
                      {{ summarize(item.command).method || 'GET' }}
                    </span>
                    <span
                      v-if="item.result?.statusCode"
                      class="status-pill"
                      :class="`tone-${statusTone(item.result.statusCode)}`"
                    >
                      {{ item.result.statusCode }}
                    </span>
                    <span v-else-if="item.result?.error" class="status-pill tone-err">
                      ERR
                    </span>
                    <span class="url-text" :title="summarize(item.command).url">
                      {{ urlPath(summarize(item.command).url) || t('history.untitled') }}
                    </span>
                    <button
                      type="button"
                      class="fav-btn"
                      :class="{ 'is-fav': item.favorite }"
                      :title="item.favorite ? t('history.unfavorite') : t('history.favorite')"
                      :aria-label="item.favorite ? t('history.unfavorite') : t('history.favorite')"
                      :aria-pressed="!!item.favorite"
                      @click="handleToggleFavorite(item, $event)"
                    >
                      <el-icon>
                        <StarFilled v-if="item.favorite" />
                        <Star v-else />
                      </el-icon>
                    </button>
                    <button
                      type="button"
                      class="del-btn"
                      :title="t('history.remove')"
                      @click="handleRemove(item, $event)"
                    >
                      <el-icon><Close /></el-icon>
                    </button>
                  </div>
                  <div class="row-bot">
                    <time
                      class="time"
                      :datetime="new Date(item.timestamp).toISOString()"
                      :title="formatExecTimeFull(item.timestamp)"
                    >
                      {{ formatExecTime(item.timestamp) }}
                    </time>
                    <span v-if="item.result?.timeMs != null" class="dot">·</span>
                    <span v-if="item.result?.timeMs != null">
                      {{ item.result.timeMs }} ms
                    </span>
                  </div>
                </button>
              </div>
            </template>
          </template>
        </div>

        <div v-if="items.length" class="history-footer">
          <span class="muted">
            {{ visibleCount }} / {{ items.length }}
            <span v-if="favoriteCount" class="fav-count">
              <el-icon><StarFilled /></el-icon>
              {{ favoriteCount }}
            </span>
          </span>
          <el-button
            link
            type="danger"
            :icon="Delete"
            size="small"
            :disabled="items.length === favoriteCount"
            @click="handleClearAll"
          >
            {{ t('history.clear') }}
          </el-button>
        </div>
      </template>
    </div>
  </el-popover>
</template>

<style scoped>
.count-badge {
  display: inline-block;
  margin-left: 6px;
  background: var(--hover-strong);
  color: var(--accent);
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 8px;
  font-weight: 700;
}

.history-panel {
  display: flex;
  flex-direction: column;
  max-height: 520px;
}

.not-accepted {
  padding: 8px 4px;
  text-align: center;
}
.na-title {
  font-weight: 600;
  margin-bottom: 4px;
}
.na-msg {
  color: var(--text-dim);
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.search-wrap {
  position: relative;
  margin-bottom: 8px;
}
.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-dim);
  font-size: 14px;
  pointer-events: none;
}
.search-input {
  width: 100%;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font-size: 13px;
  padding: 7px 10px 7px 30px;
  outline: none;
}
.search-input:focus {
  border-color: var(--accent);
}
.search-input::placeholder {
  color: var(--text-mute);
}

.empty-tip {
  padding: 24px 8px;
  text-align: center;
  color: var(--text-dim);
  font-size: 12px;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  margin: 0 -4px;
  padding: 0 4px;
}

.history-item {
  position: relative;
  display: block;
  width: 100%;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 7px;
  padding: 8px 8px;
  margin-bottom: 4px;
  text-align: left;
  cursor: pointer;
  color: var(--text);
  transition: background 0.12s, border-color 0.12s;
}
.history-item:hover {
  background: var(--hover);
}
.history-item.active {
  background: var(--active);
  border-color: var(--active-border);
}
.history-item.is-fav::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(180deg, #f5b94a, #e69a1a);
}

/* 分组父项：只显示 path 与计数，单独的视觉风格 */
.group-header {
  padding: 6px 8px;
}
.group-header.has-active-child {
  background: var(--hover);
}
.group-header .row-top {
  align-items: center;
}
.group-header .path-text {
  font-weight: 600;
  color: var(--text);
}

.caret {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  font-size: 12px;
  color: var(--text-dim);
  transition: transform 0.15s ease;
  flex-shrink: 0;
}
.caret.open {
  transform: rotate(90deg);
}

.group-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  background: var(--kbd-bg);
  color: var(--text-dim);
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--mono);
  flex-shrink: 0;
  letter-spacing: 0.3px;
}
.group-header.has-active-child .group-count {
  background: var(--hover-strong);
  color: var(--accent);
}

/* 二级菜单：子项列表沿用 history-item 样式，缩进并配上视觉引导线 */
.group-children {
  position: relative;
  margin: 0 0 4px 6px;
  padding-left: 10px;
  border-left: 1px dashed var(--border);
}
.group-children .history-item {
  padding: 6px 8px;
  margin-bottom: 2px;
}
.group-children .history-item:last-child {
  margin-bottom: 4px;
}

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
.history-item:hover .fav-btn {
  opacity: 0.9;
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
.history-item:hover .del-btn {
  opacity: 1;
}
.del-btn:hover {
  color: var(--danger);
  background: rgba(214, 57, 72, 0.12);
}

.history-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  margin-top: 6px;
  border-top: 1px solid var(--border);
}
.muted {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-dim);
  font-size: 11px;
  font-family: var(--mono);
}
.fav-count {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #f5b94a;
  padding-left: 4px;
  border-left: 1px solid var(--border);
}
.fav-count .el-icon {
  font-size: 11px;
}
</style>

<style>
.history-popover.el-popper {
  background: var(--panel-2) !important;
  border: 1px solid var(--border) !important;
  padding: 10px !important;
  border-radius: 10px !important;
  box-shadow: var(--shadow-strong) !important;
}
</style>
