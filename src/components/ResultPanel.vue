<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import {
  DocumentCopy,
  Download,
  Loading,
  Monitor,
  Document,
  Share,
  Connection,
  Search,
  ArrowUp,
  ArrowDown,
} from '@element-plus/icons-vue';
import type { ExecuteResult } from '../api/execute';
import { DESKTOP_DOWNLOAD_URL } from '../config/links';
import JsonTreeView from './JsonTreeView.vue';
import JsonMindMap from './JsonMindMap.vue';
import { searchJson } from '../utils/jsonSearch';
import { openExternal } from '../utils/openExternal';

type BodyFormat = 'text' | 'tree' | 'mind';

const props = defineProps<{
  result: ExecuteResult | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'retry-with-server'): void;
}>();

const { t } = useI18n();
const activeTab = ref<'body' | 'headers' | 'raw'>('body');
// 默认 tree 视图：JSON 场景占多数，树形比纯文本更易读
const bodyFormat = ref<BodyFormat>('tree');
const searchQuery = ref('');
const currentMatchIndex = ref(0);

watch(
  () => props.result,
  () => {
    activeTab.value = 'body';
    bodyFormat.value = 'tree';
    searchQuery.value = '';
    currentMatchIndex.value = 0;
  }
);

const isMac = computed(() => {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
});
const hotkeyRun = computed(() => (isMac.value ? '⌘↵' : 'Ctrl+↵'));

const statusTone = computed<'success' | 'warning' | 'danger' | 'info'>(() => {
  const code = props.result?.statusCode;
  if (!code) return 'info';
  if (code >= 200 && code < 300) return 'success';
  if (code >= 300 && code < 400) return 'info';
  if (code >= 400 && code < 500) return 'warning';
  return 'danger';
});

const isJson = computed(() => {
  const ct = props.result?.contentType || '';
  if (ct.includes('application/json')) return true;
  const body = props.result?.body?.trim() || '';
  return (
    (body.startsWith('{') && body.endsWith('}')) ||
    (body.startsWith('[') && body.endsWith(']'))
  );
});

const prettyBody = computed(() => {
  const body = props.result?.body ?? '';
  if (!body) return '';
  if (isJson.value) {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  }
  return body;
});

function formatSize(bytes: number | null | undefined): string {
  if (bytes == null) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function copyBody() {
  if (!props.result) return;
  try {
    await navigator.clipboard.writeText(prettyBody.value);
    ElMessage.success(t('messages.copyBodyOk'));
  } catch {
    ElMessage.warning(t('messages.copyFailed'));
  }
}

function downloadBody() {
  if (!props.result) return;
  const blob = new Blob([props.result.body], {
    type: props.result.contentType || 'text/plain',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const ext = isJson.value ? 'json' : 'txt';
  a.download = `response-${Date.now()}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

function highlightJson(json: string): string {
  if (!json) return '';
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'tok-num';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'tok-key' : 'tok-str';
      } else if (/true|false/.test(match)) {
        cls = 'tok-bool';
      } else if (/null/.test(match)) {
        cls = 'tok-null';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

const highlightedBody = computed(() => {
  if (!isJson.value) return '';
  return highlightJson(prettyBody.value);
});

/** 仅 JSON 时尝试解析；解析失败 → null，UI 自动回退到 text 模式 */
const parsedBody = computed<unknown>(() => {
  if (!isJson.value) return null;
  const body = props.result?.body ?? '';
  if (!body) return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
});

const canShowStructured = computed(() => parsedBody.value !== null);

const searchActive = computed(
  () => activeTab.value === 'body' && bodyFormat.value === 'tree' && canShowStructured.value
);

const searchResult = computed(() => {
  if (!searchActive.value || !searchQuery.value.trim()) {
    return { matches: [], expandedPaths: new Set<string>(), truncated: false };
  }
  return searchJson(parsedBody.value, searchQuery.value, { maxMatches: 500 });
});

const totalMatches = computed(() => searchResult.value.matches.length);

watch([searchQuery, () => bodyFormat.value, () => parsedBody.value], () => {
  currentMatchIndex.value = 0;
});

const safeCurrentIndex = computed(() => {
  if (!totalMatches.value) return -1;
  const max = totalMatches.value - 1;
  const i = currentMatchIndex.value;
  if (i < 0) return 0;
  if (i > max) return max;
  return i;
});

const currentMatchPath = computed<string | null>(() => {
  if (safeCurrentIndex.value < 0) return null;
  return searchResult.value.matches[safeCurrentIndex.value].pathKey;
});

function gotoMatch(delta: number) {
  if (!totalMatches.value) return;
  const total = totalMatches.value;
  currentMatchIndex.value = (safeCurrentIndex.value + delta + total) % total;
}

function onSearchEnter(event: KeyboardEvent) {
  gotoMatch(event.shiftKey ? -1 : 1);
}

interface FormatOption {
  key: BodyFormat;
  labelKey: string;
  icon: typeof Document;
}
const FORMAT_OPTIONS: FormatOption[] = [
  { key: 'text', labelKey: 'result.formatText', icon: Document },
  { key: 'tree', labelKey: 'result.formatTree', icon: Share },
  { key: 'mind', labelKey: 'result.formatMind', icon: Connection },
];

const headerCount = computed(() =>
  (props.result?.headers ?? []).reduce((acc, b) => acc + b.headers.length, 0)
);
</script>

<template>
  <div class="result-root">
    <div v-if="!result && !loading" class="empty">
      <div class="empty-icon">⌁</div>
      <div class="empty-title">{{ t('result.emptyTitle') }}</div>
      <div class="empty-sub">{{ t('result.emptyHint', { hotkey: hotkeyRun }) }}</div>
    </div>

    <div v-else-if="loading && !result" class="empty">
      <el-icon class="is-loading" :size="24"><Loading /></el-icon>
      <div class="empty-sub" style="margin-top: 10px">{{ t('result.running') }}</div>
    </div>

    <template v-else-if="result">
      <div class="result-header">
        <div class="status-row">
          <el-tag :type="statusTone" effect="dark" round size="large">
            <template v-if="result.statusCode">
              {{ result.statusCode }}
            </template>
            <template v-else>
              {{ result.ok ? 'OK' : 'ERROR' }}
            </template>
          </el-tag>
          <div class="url" :title="result.url || ''">
            {{ result.url || '—' }}
          </div>
        </div>

        <div class="meta-row">
          <div class="meta-item">
            <span class="meta-label">{{ t('result.metaTime') }}</span>
            <span class="meta-value">{{
              result.timeMs != null ? result.timeMs + ' ms' : '-'
            }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">{{ t('result.metaSize') }}</span>
            <span class="meta-value">{{ formatSize(result.sizeBytes) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">{{ t('result.metaType') }}</span>
            <span class="meta-value mono">{{ result.contentType || '-' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">{{ t('result.metaExit') }}</span>
            <span class="meta-value">{{ result.exitCode ?? '-' }}</span>
          </div>
        </div>

        <div v-if="result.error" class="error-block">
          <div class="error-title">{{ t('result.errorTitle') }}</div>
          <pre>{{ result.error }}{{ result.hint ? '\n' + result.hint : '' }}</pre>
          <div v-if="result.corsLike && result.engine === 'browser'" class="error-action">
            <div class="cors-hint">{{ t('engine.corsHint') }}</div>
            <div class="error-action-buttons">
              <el-button size="small" type="primary" @click="emit('retry-with-server')">
                {{ t('engine.retryWithServer') }}
              </el-button>
              <a
                class="download-desktop-btn"
                :href="DESKTOP_DOWNLOAD_URL"
                target="_blank"
                rel="noopener noreferrer"
                @click.prevent="openExternal(DESKTOP_DOWNLOAD_URL)"
              >
                <el-icon :size="14"><Monitor /></el-icon>
                <span>{{ t('engine.downloadDesktop') }}</span>
              </a>
            </div>
            <div class="desktop-hint">{{ t('engine.desktopAppHint') }}</div>
          </div>
        </div>

        <div v-if="result.unsupported && result.unsupported.length" class="warn-block">
          <div class="warn-title">{{ t('engine.unsupportedTitle') }}</div>
          <ul class="warn-list">
            <li v-for="(u, idx) in result.unsupported" :key="idx">{{ u }}</li>
          </ul>
        </div>
        <div v-if="result.stderr" class="error-block stderr">
          <div class="error-title">{{ t('result.stderrTitle') }}</div>
          <pre>{{ result.stderr }}</pre>
        </div>
      </div>

      <div class="tab-row">
        <button
          class="tab"
          :class="{ active: activeTab === 'body' }"
          @click="activeTab = 'body'"
        >
          {{ t('result.tabBody') }}
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'headers' }"
          @click="activeTab = 'headers'"
        >
          {{ t('result.tabHeaders') }}
          <span class="badge" v-if="headerCount">{{ headerCount }}</span>
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'raw' }"
          @click="activeTab = 'raw'"
        >
          {{ t('result.tabRaw') }}
        </button>

        <div class="tab-actions">
          <div
            v-if="activeTab === 'body' && canShowStructured"
            class="format-switch"
            role="tablist"
            :aria-label="t('result.formatLabel')"
          >
            <button
              v-for="opt in FORMAT_OPTIONS"
              :key="opt.key"
              type="button"
              class="format-btn"
              :class="{ active: bodyFormat === opt.key }"
              :aria-selected="bodyFormat === opt.key"
              :title="t(opt.labelKey)"
              @click="bodyFormat = opt.key"
            >
              <el-icon :size="13"><component :is="opt.icon" /></el-icon>
              <span class="format-btn-text">{{ t(opt.labelKey) }}</span>
            </button>
          </div>
          <el-button :icon="DocumentCopy" link @click="copyBody">
            {{ t('result.actionCopy') }}
          </el-button>
          <el-button :icon="Download" link @click="downloadBody">
            {{ t('result.actionDownload') }}
          </el-button>
        </div>
      </div>

      <div
        v-if="searchActive"
        class="json-search-bar"
        :class="{ 'has-query': !!searchQuery.trim() }"
      >
        <el-input
          v-model="searchQuery"
          :placeholder="t('result.searchPlaceholder')"
          size="small"
          clearable
          :prefix-icon="Search"
          @keydown.enter="onSearchEnter"
        />
        <div v-if="searchQuery.trim()" class="search-meta">
          <span v-if="totalMatches" class="search-count" aria-live="polite">
            {{ safeCurrentIndex + 1 }} / {{ totalMatches }}{{ searchResult.truncated ? '+' : '' }}
          </span>
          <span v-else class="search-count search-count-empty" aria-live="polite">
            {{ t('result.searchEmpty') }}
          </span>
          <button
            type="button"
            class="search-nav-btn"
            :disabled="!totalMatches"
            :title="t('result.searchPrev')"
            :aria-label="t('result.searchPrev')"
            @click="gotoMatch(-1)"
          >
            <el-icon :size="13"><ArrowUp /></el-icon>
          </button>
          <button
            type="button"
            class="search-nav-btn"
            :disabled="!totalMatches"
            :title="t('result.searchNext')"
            :aria-label="t('result.searchNext')"
            @click="gotoMatch(1)"
          >
            <el-icon :size="13"><ArrowDown /></el-icon>
          </button>
        </div>
      </div>

      <div class="tab-body" :class="{ 'no-pad': activeTab === 'body' && bodyFormat === 'mind' && canShowStructured }">
        <template v-if="activeTab === 'body'">
          <div v-if="!result.body" class="muted">{{ t('result.emptyBody') }}</div>
          <template v-else-if="canShowStructured && bodyFormat === 'tree'">
            <JsonTreeView
              :data="parsedBody"
              :query="searchQuery"
              :force-expanded-paths="searchResult.expandedPaths"
              :current-match-path="currentMatchPath"
            />
          </template>
          <template v-else-if="canShowStructured && bodyFormat === 'mind'">
            <JsonMindMap :data="parsedBody" />
          </template>
          <pre v-else-if="isJson" class="code" v-html="highlightedBody" />
          <pre v-else class="code">{{ prettyBody }}</pre>
        </template>

        <template v-else-if="activeTab === 'headers'">
          <div v-if="!result.headers.length" class="muted">
            {{ t('result.emptyHeaders') }}
          </div>
          <div v-else class="headers-list">
            <div
              v-for="(block, bi) in result.headers"
              :key="bi"
              class="header-block"
            >
              <div class="status-line">{{ block.statusLine }}</div>
              <table class="header-table">
                <tbody>
                  <tr v-for="(h, hi) in block.headers" :key="hi">
                    <td class="h-name">{{ h.name }}</td>
                    <td class="h-value">{{ h.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <template v-else>
          <pre class="code">{{ result.body }}</pre>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.result-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--panel);
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
}
.empty-icon {
  font-size: 56px;
  opacity: 0.3;
}
.empty-title {
  margin-top: 8px;
  font-size: 16px;
  color: var(--text);
}
.empty-sub {
  margin-top: 4px;
  font-size: 13px;
}

.result-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--panel-2);
}
.status-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.url {
  flex: 1;
  min-width: 0;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta-row {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.meta-item {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.meta-label {
  font-size: 11px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.meta-value {
  font-size: 13px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta-value.mono {
  font-family: var(--mono);
}

.error-block {
  margin-top: 12px;
  border: 1px solid rgba(214, 57, 72, 0.35);
  background: rgba(214, 57, 72, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
}
.error-block.stderr {
  border-color: rgba(194, 112, 10, 0.3);
  background: rgba(194, 112, 10, 0.06);
}
.error-title {
  font-size: 12px;
  color: var(--danger);
  font-weight: 600;
  margin-bottom: 6px;
}
.error-block.stderr .error-title {
  color: var(--warn);
}
.error-block pre {
  margin: 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
}
.error-action {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.cors-hint {
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.5;
}
.error-action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.download-desktop-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text);
  background: var(--panel-2);
  border: 1px solid var(--border-strong);
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s, transform 0.05s;
  line-height: 1;
}
.download-desktop-btn:hover {
  background: var(--hover);
  border-color: var(--accent);
  color: var(--accent);
}
.download-desktop-btn:active {
  transform: translateY(1px);
}
.desktop-hint {
  font-size: 11px;
  color: var(--text-faint);
  line-height: 1.5;
}

.warn-block {
  margin-top: 12px;
  border: 1px solid rgba(194, 112, 10, 0.3);
  background: rgba(194, 112, 10, 0.06);
  border-radius: 8px;
  padding: 10px 12px;
}
.warn-title {
  font-size: 12px;
  color: var(--warn);
  font-weight: 600;
  margin-bottom: 6px;
}
.warn-list {
  margin: 0;
  padding-left: 18px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
}
.warn-list li {
  line-height: 1.6;
}

.tab-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
  background: var(--panel-2);
  padding: 0 8px;
}
.tab {
  background: transparent;
  border: none;
  color: var(--text-dim);
  font-size: 13px;
  padding: 10px 14px;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.tab:hover {
  color: var(--text);
}
.tab.active {
  color: var(--text);
}
.tab.active::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: -1px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  border-radius: 2px;
}
.badge {
  font-size: 10px;
  background: var(--kbd-bg);
  border-radius: 8px;
  padding: 1px 6px;
}
.tab-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 6px;
}

.format-switch {
  display: inline-flex;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
}
.format-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  padding: 3px 9px;
  font-size: 12px;
  font-family: inherit;
  border-radius: 4px;
  line-height: 1.4;
  transition: background 0.12s, color 0.12s;
}
.format-btn:hover {
  color: var(--text);
}
.format-btn.active {
  background: var(--panel-2);
  color: var(--accent);
  box-shadow: 0 0 0 1px var(--border-strong);
}
.format-btn-text {
  font-weight: 500;
}

.json-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--panel-2);
  border-bottom: 1px solid var(--border);
}
.json-search-bar :deep(.el-input) {
  flex: 1;
  max-width: 360px;
}
.search-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-dim);
  user-select: none;
}
.search-count {
  font-family: var(--mono);
  font-variant-numeric: tabular-nums;
  min-width: 56px;
  text-align: center;
}
.search-count-empty {
  color: var(--warn);
}
.search-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-dim);
  cursor: pointer;
  transition: color 0.12s, border-color 0.12s, background 0.12s;
  padding: 0;
}
.search-nav-btn:hover:not(:disabled) {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--hover);
}
.search-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tab-body {
  flex: 1;
  overflow: auto;
  padding: 14px 16px;
  background: var(--panel);
}
.tab-body.no-pad {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.tab-body.no-pad > * {
  flex: 1;
  min-height: 0;
}
.muted {
  color: var(--text-dim);
  font-size: 13px;
}
.code {
  margin: 0;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
}

.headers-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.header-block {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.status-line {
  padding: 8px 12px;
  background: var(--panel-2);
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
}
.header-table {
  width: 100%;
  border-collapse: collapse;
}
.header-table td {
  padding: 6px 12px;
  font-family: var(--mono);
  font-size: 12px;
  vertical-align: top;
  border-bottom: 1px solid var(--border);
  word-break: break-all;
}
.header-table tr:last-child td {
  border-bottom: none;
}
.h-name {
  color: var(--accent);
  width: 28%;
  white-space: nowrap;
  padding-right: 12px !important;
}
.h-value {
  color: var(--text);
}

:deep(.tok-key) {
  color: var(--tok-key);
}
:deep(.tok-str) {
  color: var(--tok-str);
}
:deep(.tok-num) {
  color: var(--tok-num);
}
:deep(.tok-bool) {
  color: var(--tok-bool);
}
:deep(.tok-null) {
  color: var(--tok-null);
  font-style: italic;
}
</style>
