<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
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
import {
  findTextMatches,
  isValidRegex,
  renderTextWithHighlights,
  searchJson,
  type SearchTarget,
} from '../utils/jsonSearch';
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
// 正则模式开关——刻意做成"跨结果保留"的 UI 偏好，避免每次执行后用户都要重新勾选
const regexMode = ref(false);
// JSON 搜索目标：默认 key + value 一起搜；切换到 key/value 时单独过滤
const searchTarget = ref<SearchTarget>('both');

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

/** 当前激活的"展示介质"——驱动搜索逻辑分支 */
type SearchScope = 'tree' | 'mind' | 'text-body' | 'text-raw' | 'none';

const searchScope = computed<SearchScope>(() => {
  if (!props.result?.body) return 'none';
  if (activeTab.value === 'raw') return 'text-raw';
  if (activeTab.value !== 'body') return 'none';
  if (bodyFormat.value === 'tree' && canShowStructured.value) return 'tree';
  if (bodyFormat.value === 'mind' && canShowStructured.value) return 'mind';
  // 包括 bodyFormat === 'text'，以及非 JSON 时强制回落的 pre 渲染
  return 'text-body';
});

/** 搜索条是否显示：body / raw 任一展示模式 + 有 body 即显示 */
const searchActive = computed(() => searchScope.value !== 'none');

/** 文本模式下用于搜索的原文：body 模式用 prettyBody，raw 模式用原始 body */
const searchableText = computed(() => {
  if (searchScope.value === 'text-body') return prettyBody.value;
  if (searchScope.value === 'text-raw') return props.result?.body ?? '';
  return '';
});

const treeSearch = computed(() => {
  if (searchScope.value !== 'tree' || !searchQuery.value.trim()) {
    return { matches: [], expandedPaths: new Set<string>(), truncated: false };
  }
  return searchJson(parsedBody.value, searchQuery.value, {
    maxMatches: 500,
    regex: regexMode.value,
    target: searchTarget.value,
  });
});

const textSearch = computed(() => {
  if (
    (searchScope.value !== 'text-body' && searchScope.value !== 'text-raw') ||
    !searchQuery.value.trim()
  ) {
    return { matches: [], truncated: false };
  }
  return findTextMatches(searchableText.value, searchQuery.value, {
    maxMatches: 2000,
    regex: regexMode.value,
  });
});

/** 规则模式下 query 是否能编译成正则；用来红色提示，并屏蔽 0 命中提示 */
const regexInvalid = computed(() => {
  if (!regexMode.value || !searchQuery.value.trim()) return false;
  return !isValidRegex(searchQuery.value);
});

/** mind 模式的命中数由 JsonMindMap 通过 @update:total-matches 上报 */
const mindTotalMatches = ref(0);

const totalMatches = computed(() => {
  switch (searchScope.value) {
    case 'tree':
      return treeSearch.value.matches.length;
    case 'mind':
      return mindTotalMatches.value;
    case 'text-body':
    case 'text-raw':
      return textSearch.value.matches.length;
    default:
      return 0;
  }
});

/** 显示 "X / Y+" 用：tree / text 有截断信号；mind 暂不暴露 */
const isTruncated = computed(() => {
  switch (searchScope.value) {
    case 'tree':
      return treeSearch.value.truncated;
    case 'text-body':
    case 'text-raw':
      return textSearch.value.truncated;
    default:
      return false;
  }
});

// 切换 tab / 切换 body 格式 / 数据变化 / query / 正则模式 / 搜索目标 任一变 → 复位
watch(
  [
    searchQuery,
    () => bodyFormat.value,
    () => activeTab.value,
    () => parsedBody.value,
    regexMode,
    searchTarget,
  ],
  () => {
    currentMatchIndex.value = 0;
  }
);

const safeCurrentIndex = computed(() => {
  if (!totalMatches.value) return -1;
  const max = totalMatches.value - 1;
  const i = currentMatchIndex.value;
  if (i < 0) return 0;
  if (i > max) return max;
  return i;
});

/** tree 模式专用：当前命中节点的 pathKey */
const currentMatchPath = computed<string | null>(() => {
  if (searchScope.value !== 'tree' || safeCurrentIndex.value < 0) return null;
  return treeSearch.value.matches[safeCurrentIndex.value].pathKey;
});

/** text 模式下的渲染 HTML（含 <mark> 高亮）——v-html 安全：内部 escape 过 */
const textHighlightedHtml = computed(() => {
  if (searchScope.value !== 'text-body' && searchScope.value !== 'text-raw') return '';
  return renderTextWithHighlights(
    searchableText.value,
    searchQuery.value,
    safeCurrentIndex.value,
    { regex: regexMode.value }
  );
});

/** text-body 模式：未搜索时退回 JSON 语法高亮的 html；搜索期间让位给 mark 高亮（更直观） */
const bodyHtml = computed(() => {
  if (searchQuery.value.trim()) return textHighlightedHtml.value;
  if (isJson.value) return highlightedBody.value;
  return '';
});

const isTextLikeRender = computed(
  () => searchScope.value === 'text-body' || searchScope.value === 'text-raw'
);

const textBodyRef = ref<HTMLElement | null>(null);
const rawBodyRef = ref<HTMLElement | null>(null);

/** 当前 match 切换时，把对应 <mark.current-hit> 滚入视口正中央，
 * 让人在大段文本里一眼能锁定高亮，而不是被卷到视口边缘 */
watch([safeCurrentIndex, textHighlightedHtml], async () => {
  if (!isTextLikeRender.value || safeCurrentIndex.value < 0) return;
  await nextTick();
  const root =
    searchScope.value === 'text-raw' ? rawBodyRef.value : textBodyRef.value;
  const el = root?.querySelector('.current-hit') as HTMLElement | null;
  el?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
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

interface TargetOption {
  key: SearchTarget;
  labelKey: string;
}
const TARGET_OPTIONS: TargetOption[] = [
  { key: 'both', labelKey: 'result.searchTargetAll' },
  { key: 'key', labelKey: 'result.searchTargetKey' },
  { key: 'value', labelKey: 'result.searchTargetValue' },
];

/** key/value 过滤只在结构化视图（tree / mind）下有意义；文本/原始模式没有 key/value 概念 */
const showSearchTarget = computed(
  () => searchScope.value === 'tree' || searchScope.value === 'mind'
);

const headerCount = computed(() =>
  (props.result?.headers ?? []).reduce((acc, b) => acc + b.headers.length, 0)
);
</script>

<template>
  <div class="result-root" :class="{ 'is-loading': loading }">
    <div v-if="loading" class="progress-bar" aria-hidden="true">
      <span class="progress-bar-track" />
    </div>
    <div v-if="!result && !loading" class="empty">
      <div class="empty-icon">⌁</div>
      <div class="empty-title">{{ t('result.emptyTitle') }}</div>
      <div class="empty-sub">{{ t('result.emptyHint', { hotkey: hotkeyRun }) }}</div>
    </div>

    <div v-else-if="loading && !result" class="empty running-empty">
      <div class="running-spinner" aria-hidden="true">
        <el-icon class="is-loading running-spinner-icon" :size="40"><Loading /></el-icon>
        <span class="running-spinner-ring" />
      </div>
      <div class="empty-sub running-text">{{ t('result.running') }}</div>
      <div class="running-sub">{{ t('result.runningHint') }}</div>
    </div>

    <template v-else-if="result">
      <div v-if="loading" class="result-overlay" role="status" aria-live="polite">
        <div class="result-overlay-card">
          <div class="running-spinner">
            <el-icon class="is-loading running-spinner-icon" :size="36"><Loading /></el-icon>
            <span class="running-spinner-ring" />
          </div>
          <div class="result-overlay-text">{{ t('result.running') }}</div>
          <div class="result-overlay-sub">{{ t('result.runningHint') }}</div>
        </div>
      </div>
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
        :class="{
          'has-query': !!searchQuery.trim(),
          'regex-invalid': regexInvalid,
        }"
      >
        <el-input
          v-model="searchQuery"
          class="search-input"
          :placeholder="
            regexMode ? t('result.searchPlaceholderRegex') : t('result.searchPlaceholder')
          "
          size="small"
          clearable
          :prefix-icon="Search"
          @keydown.enter="onSearchEnter"
        >
          <template #suffix>
            <button
              type="button"
              class="search-flag-btn"
              :class="{ active: regexMode }"
              :title="t('result.regexToggle')"
              :aria-label="t('result.regexToggle')"
              :aria-pressed="regexMode"
              @click.stop="regexMode = !regexMode"
              @mousedown.prevent
            >
              .*
            </button>
          </template>
        </el-input>
        <div
          v-if="showSearchTarget"
          class="search-target-switch"
          role="tablist"
          :aria-label="t('result.searchTargetLabel')"
        >
          <button
            v-for="opt in TARGET_OPTIONS"
            :key="opt.key"
            type="button"
            class="search-target-btn"
            :class="{ active: searchTarget === opt.key }"
            :aria-selected="searchTarget === opt.key"
            :title="t(opt.labelKey)"
            @click="searchTarget = opt.key"
          >
            {{ t(opt.labelKey) }}
          </button>
        </div>
        <div v-if="searchQuery.trim()" class="search-meta">
          <span
            v-if="regexInvalid"
            class="search-count search-count-empty"
            aria-live="polite"
          >
            {{ t('result.regexInvalid') }}
          </span>
          <span v-else-if="totalMatches" class="search-count" aria-live="polite">
            {{ safeCurrentIndex + 1 }} / {{ totalMatches }}{{ isTruncated ? '+' : '' }}
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
              :regex="regexMode"
              :target="searchTarget"
              :force-expanded-paths="treeSearch.expandedPaths"
              :current-match-path="currentMatchPath"
            />
          </template>
          <template v-else-if="canShowStructured && bodyFormat === 'mind'">
            <JsonMindMap
              :data="parsedBody"
              :query="searchQuery"
              :regex="regexMode"
              :target="searchTarget"
              :current-match-index="safeCurrentIndex"
              @update:total-matches="mindTotalMatches = $event"
            />
          </template>
          <!-- text-body: JSON 时未搜索走语法着色；其它情况走 search-aware 渲染 -->
          <pre
            v-else-if="bodyHtml"
            ref="textBodyRef"
            class="code"
            v-html="bodyHtml"
          />
          <pre v-else ref="textBodyRef" class="code">{{ prettyBody }}</pre>
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
          <pre
            v-if="searchQuery.trim()"
            ref="rawBodyRef"
            class="code"
            v-html="textHighlightedHtml"
          />
          <pre v-else ref="rawBodyRef" class="code">{{ result.body }}</pre>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.result-root {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--panel);
}

/* 顶部 indeterminate 进度条：始终覆盖在面板最上方 */
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(64, 158, 255, 0.12);
  overflow: hidden;
  z-index: 10;
  pointer-events: none;
}
.progress-bar-track {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--accent, #409eff),
    var(--accent-2, #79bbff),
    transparent
  );
  animation: result-progress-slide 1.1s ease-in-out infinite;
  border-radius: 3px;
}
@keyframes result-progress-slide {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}

/* 复用 Element Plus 旋转 icon 类，再叠加自定义环形动画 */
.running-spinner {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
}
.running-spinner-icon {
  color: var(--accent, #409eff);
  z-index: 1;
}
.running-spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(64, 158, 255, 0.22);
  border-top-color: var(--accent, #409eff);
  animation: spinner-rotate 1s linear infinite;
}
@keyframes spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}

.running-empty {
  gap: 14px;
}
.running-text {
  font-size: 15px;
  color: var(--text);
  font-weight: 500;
}
.running-sub {
  font-size: 12px;
  color: var(--text-dim);
}

/* 已有结果时再触发执行：半透明遮罩 + 中心卡片，保留底层结果但不可交互 */
.result-overlay {
  position: absolute;
  inset: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--panel) 60%, transparent);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  animation: overlay-fade-in 0.15s ease-out;
}
@keyframes overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.result-overlay-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  border-radius: 12px;
  background: var(--panel);
  border: 1px solid var(--border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  min-width: 200px;
}
.result-overlay-text {
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
}
.result-overlay-sub {
  font-size: 12px;
  color: var(--text-dim);
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
/* 非法正则：把输入框描红，与 search-count 的"Invalid regex"文字呼应 */
.json-search-bar.regex-invalid :deep(.search-input .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--danger, #d63948) inset;
}

/* el-input 内部的 .* 切换按钮：模仿 VSCode 搜索栏 */
.search-flag-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  padding: 0;
  user-select: none;
  transition: background 0.12s, color 0.12s;
}
.search-flag-btn:hover {
  color: var(--text);
  background: var(--hover);
}
.search-flag-btn.active {
  background: color-mix(in srgb, var(--accent, #409eff) 18%, transparent);
  color: var(--accent, #409eff);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent, #409eff) 55%, transparent);
}

/* "全部 / 键 / 值" 切换：与 .format-switch 同款视觉，避免引入新风格 */
.search-target-switch {
  display: inline-flex;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
  flex-shrink: 0;
}
.search-target-btn {
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  padding: 3px 10px;
  font-size: 12px;
  font-family: inherit;
  border-radius: 4px;
  line-height: 1.4;
  transition: background 0.12s, color 0.12s;
}
.search-target-btn:hover {
  color: var(--text);
}
.search-target-btn.active {
  background: var(--panel-2);
  color: var(--accent);
  box-shadow: 0 0 0 1px var(--border-strong);
  font-weight: 500;
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

/* text / raw 模式下的搜索命中高亮（v-html 渲染，所以要 :deep 才能击穿 scoped） */
:deep(.search-hit) {
  background: rgba(255, 213, 79, 0.55);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
  font-weight: 600;
}
:deep(.current-hit) {
  background: rgba(245, 185, 74, 0.95);
  color: #1a1a1a;
  box-shadow: 0 0 0 2px rgba(245, 185, 74, 0.45);
  outline: none;
}
[data-theme='dark'] :deep(.search-hit) {
  background: rgba(255, 184, 0, 0.42);
  color: #ffe9a8;
}
[data-theme='dark'] :deep(.current-hit) {
  background: rgba(245, 185, 74, 0.95);
  color: #181818;
  box-shadow: 0 0 0 2px rgba(245, 185, 74, 0.55);
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
