<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Clock,
  Delete,
  Search,
  StarFilled,
  ArrowRight,
} from '@element-plus/icons-vue';
import { useHistory, type HistoryItem } from '../composables/useHistory';
import { useConsent } from '../composables/useConsent';
import { extractCurlSummary } from '../utils/curl';
import HistoryItemRow from './HistoryItemRow.vue';

const props = withDefaults(
  defineProps<{
    /** 当前命令，用于高亮匹配项 */
    currentCommand: string;
    /**
     * 'history'：展示全部历史（默认）
     * 'favorites'：仅展示收藏；触发按钮换图标、隐藏"清空"按钮、显示不同的空态文案。
     * 两种模式底层共用同一份 useHistory() 数据源，所以"清空历史不影响收藏"是自然成立的。
     */
    mode?: 'history' | 'favorites';
  }>(),
  { mode: 'history' }
);

const emit = defineEmits<{
  (e: 'pick', item: HistoryItem): void;
}>();

const { t } = useI18n();
const { items, count, favoriteCount, remove, toggleFavorite, clear } = useHistory();
const { isAccepted, accept } = useConsent();

const isFavMode = computed(() => props.mode === 'favorites');

/** 触发按钮上展示的数量：收藏夹模式只数收藏 */
const triggerCount = computed(() =>
  isFavMode.value ? favoriteCount.value : count.value
);

/** 触发按钮上的 i18n 标签 */
const triggerLabel = computed(() =>
  isFavMode.value ? t('favorites.title') : t('history.title')
);

/** 列表渲染前先按模式过滤；favorites 模式只看 favorite 项 */
const baseItems = computed<HistoryItem[]>(() =>
  isFavMode.value ? items.value.filter((i) => i.favorite) : items.value
);

/** 当前模式下"完全无内容"时的提示文案 */
const emptyTip = computed(() =>
  isFavMode.value ? t('favorites.empty') : t('history.empty')
);

const visible = ref(false);
const keyword = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

/** 用户主动展开过的分组（按 path key 记录），search 模式下会无条件展开所有匹配组 */
const expandedKeys = ref<Set<string>>(new Set());

/** 二级（path）分组：同一 host 下，按 pathname 聚合多次执行 */
interface HistoryPathGroup {
  /** 唯一键，形如 `path:https://api.example.com/users` */
  key: string;
  /** 展示用的 pathname；无 URL 时为空 */
  pathDisplay: string;
  /** 组内成员，按 favorite 优先 + 时间倒序 */
  items: HistoryItem[];
  hasFavorite: boolean;
  /** 是否包含 activeId */
  hasActive: boolean;
  latestTimestamp: number;
}

/** 一级（host）分组：把所有命中同一 origin 的执行收拢到一起 */
interface HistoryHostGroup {
  /** 唯一键，形如 `host:https://api.example.com`；无法解析 URL 的退化为 `host:__no_url__:<itemId>` */
  key: string;
  /** 顶层展示用的 host（含端口），如 `api.example.com:8443` */
  hostDisplay: string;
  /** 协议名（用于 tooltip 或视觉标记），如 `https` */
  schemeDisplay: string;
  paths: HistoryPathGroup[];
  /** 组内全部 item 总数（跨 path） */
  totalItems: number;
  hasFavorite: boolean;
  hasActive: boolean;
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
  // favorites 模式只在过滤后的集合里找 active，避免高亮一个根本不在面板里的条目
  return baseItems.value.find((i) => i.command.trim() === n)?.id ?? null;
});

const hostGroups = computed<HistoryHostGroup[]>(() => {
  const q = keyword.value.trim().toLowerCase();
  const base = q
    ? baseItems.value.filter((it) => {
        const s = extractCurlSummary(it.command);
        return (
          it.command.toLowerCase().includes(q) ||
          s.url.toLowerCase().includes(q) ||
          s.method.toLowerCase().includes(q)
        );
      })
    : baseItems.value;

  // 先按 host 桶分，再按 (host + pathname) 二次桶分。
  // 无法解析出 URL 的退化为单条独立 host 组，避免所有 "(无 URL)" 命令混作一处。
  const hostMap = new Map<string, Map<string, HistoryItem[]>>();
  /** 记录每个 host 的展示信息，避免重复解析 */
  const hostMeta = new Map<string, { hostDisplay: string; schemeDisplay: string }>();
  /** 记录每个 path 的展示信息 */
  const pathMeta = new Map<string, string>();

  for (const item of base) {
    const s = extractCurlSummary(item.command);
    const hostKeyRaw = urlHostKey(s.url);
    const pathName = urlPathname(s.url);

    const hostKey = hostKeyRaw
      ? `host:${hostKeyRaw}`
      : `host:__no_url__:${item.id}`;
    const pathKey = hostKeyRaw
      ? `path:${hostKeyRaw}${pathName || '/'}`
      : `path:__no_url__:${item.id}`;

    if (!hostMeta.has(hostKey)) {
      hostMeta.set(hostKey, {
        hostDisplay: hostKeyRaw ? urlHostDisplay(s.url) : '',
        schemeDisplay: hostKeyRaw ? urlScheme(s.url) : '',
      });
    }
    if (!pathMeta.has(pathKey)) {
      pathMeta.set(pathKey, hostKeyRaw ? pathName || '/' : '');
    }

    let pathMap = hostMap.get(hostKey);
    if (!pathMap) {
      pathMap = new Map();
      hostMap.set(hostKey, pathMap);
    }
    const arr = pathMap.get(pathKey);
    if (arr) arr.push(item);
    else pathMap.set(pathKey, [item]);
  }

  const result: HistoryHostGroup[] = [];
  for (const [hostKey, pathMap] of hostMap) {
    const meta = hostMeta.get(hostKey)!;
    const paths: HistoryPathGroup[] = [];

    for (const [pathKey, raw] of pathMap) {
      // items.value 已是 timestamp 倒序；这里再把收藏稳定排前
      const sorted = [...raw].sort(
        (a, b) => Number(!!b.favorite) - Number(!!a.favorite)
      );
      paths.push({
        key: pathKey,
        pathDisplay: pathMeta.get(pathKey) || '',
        items: sorted,
        hasFavorite: sorted.some((i) => i.favorite),
        hasActive: activeId.value
          ? sorted.some((i) => i.id === activeId.value)
          : false,
        latestTimestamp: sorted.reduce((m, i) => Math.max(m, i.timestamp), 0),
      });
    }

    // path 级排序：含收藏的优先、然后按最新执行时间倒序
    paths.sort((a, b) => {
      if (a.hasFavorite !== b.hasFavorite) {
        return Number(b.hasFavorite) - Number(a.hasFavorite);
      }
      return b.latestTimestamp - a.latestTimestamp;
    });

    const totalItems = paths.reduce((n, p) => n + p.items.length, 0);
    result.push({
      key: hostKey,
      hostDisplay: meta.hostDisplay,
      schemeDisplay: meta.schemeDisplay,
      paths,
      totalItems,
      hasFavorite: paths.some((p) => p.hasFavorite),
      hasActive: paths.some((p) => p.hasActive),
      latestTimestamp: paths.reduce((m, p) => Math.max(m, p.latestTimestamp), 0),
    });
  }

  // host 级排序：含收藏的优先、然后按最新执行时间倒序
  result.sort((a, b) => {
    if (a.hasFavorite !== b.hasFavorite) {
      return Number(b.hasFavorite) - Number(a.hasFavorite);
    }
    return b.latestTimestamp - a.latestTimestamp;
  });

  return result;
});

/** 当前可见的条目总数（过滤后），用于 footer "X / Y" 展示 */
const visibleCount = computed(() =>
  hostGroups.value.reduce((n, h) => n + h.totalItems, 0)
);

/**
 * 是否展开某一组（host 或 path 通用）：
 * - 搜索态：全部展开，方便看到匹配项
 * - 默认：尊重用户的 expandedKeys
 *
 * 注意：仅含 1 个 item 的 host / 仅含 1 个 item 的 path 不会进入这条逻辑（模板里直接渲染为扁平行）。
 */
function isExpanded(key: string): boolean {
  if (keyword.value.trim().length > 0) return true;
  return expandedKeys.value.has(key);
}

function toggleExpanded(key: string) {
  const next = new Set(expandedKeys.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
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

/**
 * 提取 URL 的 host 组件，作为一级（host）分组键的稳定前缀。
 * 返回形如 `https://api.example.com:8443`；无法解析时返回空串，由调用方退化为按 itemId 独立分组。
 */
function urlHostKey(url: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    const m = url.match(/^([a-zA-Z][\w+.-]*:\/\/[^/?#]+)/);
    return m ? m[1] : '';
  }
}

/** 仅 host（含端口），用于一级 header 上的展示文字 */
function urlHostDisplay(url: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.host || '';
  } catch {
    const m = url.match(/^[a-zA-Z][\w+.-]*:\/\/([^/?#]+)/);
    return m ? m[1] : '';
  }
}

/** 协议名（不含冒号），用于 host 旁的小徽标或 tooltip */
function urlScheme(url: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    return u.protocol.replace(':', '');
  } catch {
    const m = url.match(/^([a-zA-Z][\w+.-]*):\/\//);
    return m ? m[1] : '';
  }
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
      <el-button :icon="isFavMode ? StarFilled : Clock" plain :class="{ 'fav-trigger': isFavMode }">
        {{ triggerLabel }}
        <span
          v-if="isAccepted && triggerCount"
          class="count-badge"
          :class="{ 'fav-count-badge': isFavMode }"
        >
          {{ triggerCount }}
        </span>
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

        <div v-if="!baseItems.length" class="empty-tip">{{ emptyTip }}</div>
        <div v-else-if="!hostGroups.length" class="empty-tip">{{ t('history.noMatch') }}</div>

        <div v-else class="history-list">
          <template v-for="host in hostGroups" :key="host.key">
            <!-- host 仅含 1 个 item：直接渲染为扁平行，跳过 host 与 path 两层折叠 -->
            <button
              v-if="host.totalItems === 1"
              type="button"
              class="history-item"
              :class="{
                active: host.paths[0].items[0].id === activeId,
                'is-fav': host.paths[0].items[0].favorite,
              }"
              @click="handlePick(host.paths[0].items[0])"
            >
              <HistoryItemRow
                :item="host.paths[0].items[0]"
                @remove="handleRemove"
                @toggle-favorite="handleToggleFavorite"
              />
            </button>

            <!-- host 含多个 item：先渲染 host header，可展开后再按 path 二次分组 -->
            <template v-else>
              <button
                type="button"
                class="history-item host-header"
                :class="{
                  'is-fav': host.hasFavorite,
                  'has-active-child': host.hasActive,
                  'is-expanded': isExpanded(host.key),
                }"
                :aria-expanded="isExpanded(host.key)"
                :title="host.schemeDisplay ? `${host.schemeDisplay}://${host.hostDisplay}` : host.hostDisplay"
                @click="toggleExpanded(host.key)"
              >
                <div class="row-top">
                  <span
                    class="caret"
                    :class="{ open: isExpanded(host.key) }"
                    aria-hidden="true"
                  >
                    <el-icon><ArrowRight /></el-icon>
                  </span>
                  <span class="host-text">
                    {{ host.hostDisplay || t('history.untitled') }}
                  </span>
                  <span class="group-count">{{ host.totalItems }}</span>
                </div>
              </button>

              <div v-if="isExpanded(host.key)" class="group-children host-children">
                <template v-for="path in host.paths" :key="path.key">
                  <!-- path 仅含 1 个 item：跳过 path header，直接渲染该 item -->
                  <button
                    v-if="path.items.length === 1"
                    type="button"
                    class="history-item child-item"
                    :class="{
                      active: path.items[0].id === activeId,
                      'is-fav': path.items[0].favorite,
                    }"
                    @click="handlePick(path.items[0])"
                  >
                    <HistoryItemRow
                      :item="path.items[0]"
                      @remove="handleRemove"
                      @toggle-favorite="handleToggleFavorite"
                    />
                  </button>

                  <!-- path 含多个 item：渲染 path header，可展开后再列出 items -->
                  <template v-else>
                    <button
                      type="button"
                      class="history-item group-header path-header"
                      :class="{
                        'is-fav': path.hasFavorite,
                        'has-active-child': path.hasActive,
                        'is-expanded': isExpanded(path.key),
                      }"
                      :aria-expanded="isExpanded(path.key)"
                      @click="toggleExpanded(path.key)"
                    >
                      <div class="row-top">
                        <span
                          class="caret"
                          :class="{ open: isExpanded(path.key) }"
                          aria-hidden="true"
                        >
                          <el-icon><ArrowRight /></el-icon>
                        </span>
                        <span class="url-text path-text" :title="path.pathDisplay">
                          {{ path.pathDisplay || t('history.untitled') }}
                        </span>
                        <span class="group-count">{{ path.items.length }}</span>
                      </div>
                    </button>

                    <div v-if="isExpanded(path.key)" class="group-children path-children">
                      <button
                        v-for="item in path.items"
                        :key="item.id"
                        type="button"
                        class="history-item child-item"
                        :class="{ active: item.id === activeId, 'is-fav': item.favorite }"
                        @click="handlePick(item)"
                      >
                        <HistoryItemRow
                          :item="item"
                          @remove="handleRemove"
                          @toggle-favorite="handleToggleFavorite"
                        />
                      </button>
                    </div>
                  </template>
                </template>
              </div>
            </template>
          </template>
        </div>

        <div v-if="baseItems.length" class="history-footer">
          <span class="muted">
            <template v-if="isFavMode">
              <el-icon class="fav-count-icon"><StarFilled /></el-icon>
              {{ visibleCount }}<template v-if="visibleCount !== baseItems.length">
                / {{ baseItems.length }}</template>
            </template>
            <template v-else>
              {{ visibleCount }} / {{ items.length }}
              <span v-if="favoriteCount" class="fav-count">
                <el-icon><StarFilled /></el-icon>
                {{ favoriteCount }}
              </span>
            </template>
          </span>
          <!-- 收藏夹模式下不提供"清空"。清空收藏不是常见操作，且容易误触。 -->
          <el-button
            v-if="!isFavMode"
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
/* 收藏夹模式：badge 用金黄色，与 star 图标呼应，让两个触发按钮一眼区分 */
.count-badge.fav-count-badge {
  background: rgba(245, 185, 74, 0.18);
  color: #f5b94a;
}
.fav-trigger :deep(.el-icon) {
  color: #f5b94a;
}

.fav-count-icon {
  color: #f5b94a;
  font-size: 11px;
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

/* 折叠分组父项：path / host 共享的底色 */
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

/* host header：作为一级分组，比 path header 更"重"一些 */
.host-header {
  padding: 7px 8px;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--panel) 80%, transparent),
    transparent
  );
  border: 1px solid var(--border);
}
.host-header:hover {
  background: var(--hover);
}
.host-header.has-active-child {
  border-color: var(--active-border);
  background: var(--hover);
}
.host-header.is-expanded {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: 0;
}
.host-text {
  flex: 1;
  min-width: 0;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.2px;
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
.group-header.has-active-child .group-count,
.host-header.has-active-child .group-count {
  background: var(--hover-strong);
  color: var(--accent);
}

/* 二级 / 三级缩进容器：左侧 dashed 引导线 */
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

/* host 展开后的容器：贴着 header 下沿，整体感更强 */
.host-children {
  margin: -2px 0 6px 6px;
  padding: 4px 0 4px 10px;
  border-left: 1px dashed var(--border);
}

/* path header（host 展开后的子分组）的子项再缩进一层 */
.path-children {
  margin: 0 0 4px 4px;
  padding-left: 8px;
  border-left: 1px dashed var(--border);
}

/* 跨子组件的 hover：让 history-item:hover 透传到 HistoryItemRow 内的按钮 */
.history-item:hover :deep(.fav-btn) {
  opacity: 0.9;
}
.history-item:hover :deep(.del-btn) {
  opacity: 1;
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
