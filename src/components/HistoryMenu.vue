<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Clock, Delete, Search, Close } from '@element-plus/icons-vue';
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
const { items, count, remove, clear } = useHistory();
const { isAccepted, accept } = useConsent();

const visible = ref(false);
const keyword = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

const filtered = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((it) => {
    const s = extractCurlSummary(it.command);
    return (
      it.command.toLowerCase().includes(q) ||
      s.url.toLowerCase().includes(q) ||
      s.method.toLowerCase().includes(q)
    );
  });
});

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

watch(visible, (v) => {
  if (v) {
    nextTick(() => searchInput.value?.focus());
  } else {
    keyword.value = '';
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

async function handleClearAll() {
  try {
    await ElMessageBox.confirm(t('history.confirmClear'), t('history.clear'), {
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
        <div v-else-if="!filtered.length" class="empty-tip">{{ t('history.noMatch') }}</div>

        <div v-else class="history-list">
          <button
            v-for="item in filtered"
            :key="item.id"
            type="button"
            class="history-item"
            :class="{ active: item.id === activeId }"
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
                {{ summarize(item.command).url || t('history.untitled') }}
              </span>
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
              <span v-if="item.result?.timeMs != null">{{ item.result.timeMs }} ms</span>
            </div>
          </button>
        </div>

        <div v-if="items.length" class="history-footer">
          <span class="muted">{{ filtered.length }} / {{ items.length }}</span>
          <el-button
            link
            type="danger"
            :icon="Delete"
            size="small"
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

.del-btn {
  width: 22px;
  height: 22px;
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.12s, color 0.12s, background 0.12s;
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
  color: var(--text-dim);
  font-size: 11px;
  font-family: var(--mono);
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
