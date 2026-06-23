<script setup lang="ts">
/**
 * 递归 JSON 树。
 *
 * 基础用法：<JsonTreeView :data="parsedJson" />（顶层是 object/array 即可）
 *
 * 搜索增强：传入 query / forceExpandedPaths / currentMatchPath 后：
 *   - 命中节点的 key 或 value 中的匹配片段会高亮
 *   - 命中所在祖先链自动展开（来自 forceExpandedPaths）
 *   - currentMatchPath === 本节点 → 加 .is-current 高亮 + 自动 scrollIntoView
 *
 * 数据量大时，深度 > 1 的节点默认折叠，避免一次性渲染上万节点造成卡顿。
 */
import { computed, nextTick, ref, watch, watchEffect } from 'vue';
import JsonTreeView from './JsonTreeView.vue';
import { pathToKey, splitByQuery, type SearchTarget } from '../utils/jsonSearch';

const props = withDefaults(
  defineProps<{
    data: unknown;
    /** 节点名（对象的 key 或数组下标）。根节点为 null */
    name?: string | number | null;
    /** 当前深度，根 = 0 */
    depth?: number;
    /** 是否是数组元素（影响 key 颜色） */
    asArrayItem?: boolean;
    /** 从根到当前节点的路径，递归时由父级拼接传入 */
    path?: (string | number)[];
    /** 搜索词，空字符串表示无搜索 */
    query?: string;
    /** 是否以正则解析 query；与父组件的 regex 开关保持一致 */
    regex?: boolean;
    /** 匹配目标：both = key+value（默认）/ key / value */
    target?: SearchTarget;
    /** 被强制展开的容器节点 pathKey 集合（来自搜索结果） */
    forceExpandedPaths?: Set<string> | null;
    /** 当前聚焦的命中节点 pathKey，本节点匹配则会滚入视图并高亮 */
    currentMatchPath?: string | null;
  }>(),
  {
    name: null,
    depth: 0,
    asArrayItem: false,
    path: () => [],
    query: '',
    regex: false,
    target: 'both',
    forceExpandedPaths: null,
    currentMatchPath: null,
  }
);

const AUTO_EXPAND_DEPTH = 1;
const LARGE_CONTAINER_THRESHOLD = 50;

type ValueKind =
  | 'object'
  | 'array'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'undefined';

const kind = computed<ValueKind>(() => {
  const d = props.data;
  if (d === null) return 'null';
  if (d === undefined) return 'undefined';
  if (Array.isArray(d)) return 'array';
  const t = typeof d;
  if (t === 'object') return 'object';
  if (t === 'string') return 'string';
  if (t === 'number') return 'number';
  if (t === 'boolean') return 'boolean';
  return 'string';
});

const isContainer = computed(() => kind.value === 'object' || kind.value === 'array');

const childCount = computed<number>(() => {
  if (kind.value === 'array') return (props.data as unknown[]).length;
  if (kind.value === 'object') return Object.keys(props.data as object).length;
  return 0;
});

const summary = computed(() => {
  if (kind.value === 'array') return `Array(${childCount.value})`;
  if (kind.value === 'object') return `Object(${childCount.value})`;
  return '';
});

const entries = computed<Array<[string | number, unknown]>>(() => {
  if (kind.value === 'array') {
    return (props.data as unknown[]).map((v, i) => [i, v] as [number, unknown]);
  }
  if (kind.value === 'object') {
    return Object.entries(props.data as Record<string, unknown>);
  }
  return [];
});

const pathKey = computed(() => pathToKey(props.path));

const expanded = ref(
  props.depth < AUTO_EXPAND_DEPTH ||
    (isContainer.value && childCount.value <= LARGE_CONTAINER_THRESHOLD && props.depth < 2)
);

// 搜索命中所在的祖先链需要被强制展开；只设 true 不设 false，
// 这样用户后续手动折叠不会被搜索结果反复打开
watchEffect(() => {
  if (props.forceExpandedPaths?.has(pathKey.value)) {
    expanded.value = true;
  }
});

function toggle() {
  expanded.value = !expanded.value;
}

function formatPrimitive(v: unknown): string {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return JSON.stringify(v);
  return String(v);
}

const keyDisplay = computed(() => {
  if (props.name === null) return '';
  if (props.asArrayItem) return `${props.name}`;
  return `"${props.name}"`;
});

const valueDisplay = computed(() => (isContainer.value ? '' : formatPrimitive(props.data)));

// 把 query 预编译成 (s)=>boolean 的匹配器；regex 失败时退化为"不匹配任何东西"，
// 与父组件 ResultPanel 的搜索结果 0 命中行为对齐
const matcher = computed<((s: string) => boolean) | null>(() => {
  const q = props.query.trim();
  if (!q) return null;
  if (props.regex) {
    try {
      const re = new RegExp(q, 'i');
      return (s: string) => re.test(s);
    } catch {
      return null;
    }
  }
  const lowerQ = q.toLowerCase();
  return (s: string) => s.toLowerCase().includes(lowerQ);
});

// 只对对象 key 做命中（数组下标不参与搜索，与 searchJson 行为一致）。
// target === 'value' 时整体跳过 key 命中
const isKeyMatch = computed(() => {
  if (!matcher.value || props.asArrayItem || props.name === null) return false;
  if (props.target === 'value') return false;
  return matcher.value(String(props.name));
});

// target === 'key' 时跳过 value 命中
const isValueMatch = computed(() => {
  if (!matcher.value || isContainer.value || props.data === undefined) return false;
  if (props.target === 'key') return false;
  const raw =
    props.data === null
      ? 'null'
      : typeof props.data === 'string'
        ? props.data
        : String(props.data);
  return matcher.value(raw);
});

const isCurrentMatch = computed(
  () => !!props.currentMatchPath && pathKey.value === props.currentMatchPath
);

const keySegments = computed(() =>
  isKeyMatch.value
    ? splitByQuery(keyDisplay.value, props.query, { regex: props.regex })
    : null
);
const valueSegments = computed(() =>
  isValueMatch.value
    ? splitByQuery(valueDisplay.value, props.query, { regex: props.regex })
    : null
);

const rowRef = ref<HTMLElement | null>(null);

// 当前命中变化时把对应行滚入可视区
watch(
  isCurrentMatch,
  (active) => {
    if (!active) return;
    nextTick(() => {
      rowRef.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    });
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="jt-node"
    :class="{ 'jt-root': depth === 0, 'jt-container': isContainer }"
  >
    <div
      ref="rowRef"
      class="jt-row"
      :class="{
        clickable: isContainer,
        'is-current': isCurrentMatch,
      }"
      @click="isContainer && toggle()"
    >
      <span v-if="isContainer" class="jt-toggle" aria-hidden="true">
        {{ expanded ? '▾' : '▸' }}
      </span>
      <span v-else class="jt-toggle jt-toggle-spacer" aria-hidden="true"></span>

      <span
        v-if="keyDisplay"
        :class="[
          'jt-key',
          asArrayItem ? 'jt-key-idx' : 'jt-key-str',
          { 'jt-hl-row': isKeyMatch },
        ]"
      >
        <template v-if="keySegments">
          <template v-for="(seg, i) in keySegments" :key="i">
            <mark v-if="seg.match" class="jt-hl">{{ seg.text }}</mark>
            <template v-else>{{ seg.text }}</template>
          </template>
        </template>
        <template v-else>{{ keyDisplay }}</template>
        <span class="jt-colon">:</span>
      </span>

      <template v-if="isContainer">
        <span class="jt-bracket">{{ kind === 'array' ? '[' : '{' }}</span>
        <span v-if="!expanded" class="jt-summary">{{ summary }}</span>
        <span v-if="!expanded" class="jt-bracket">{{ kind === 'array' ? ']' : '}' }}</span>
      </template>
      <template v-else>
        <span :class="['jt-val', `jt-${kind}`, { 'jt-hl-row': isValueMatch }]">
          <template v-if="valueSegments">
            <template v-for="(seg, i) in valueSegments" :key="i">
              <mark v-if="seg.match" class="jt-hl">{{ seg.text }}</mark>
              <template v-else>{{ seg.text }}</template>
            </template>
          </template>
          <template v-else>{{ valueDisplay }}</template>
        </span>
      </template>
    </div>

    <template v-if="isContainer && expanded">
      <div class="jt-children">
        <JsonTreeView
          v-for="[k, v] in entries"
          :key="String(k)"
          :data="v"
          :name="k"
          :depth="depth + 1"
          :as-array-item="kind === 'array'"
          :path="[...path, k]"
          :query="query"
          :regex="regex"
          :target="target"
          :force-expanded-paths="forceExpandedPaths"
          :current-match-path="currentMatchPath"
        />
      </div>
      <div class="jt-row jt-row-close">
        <span class="jt-toggle jt-toggle-spacer" aria-hidden="true"></span>
        <span class="jt-bracket">{{ kind === 'array' ? ']' : '}' }}</span>
        <span class="jt-summary-tail">{{ summary }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.jt-node {
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.55;
  color: var(--text);
}
.jt-root {
  padding: 0;
}

.jt-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
  border-radius: 4px;
  padding: 1px 4px;
  margin: 0 -4px;
  scroll-margin: 60px;
  transition: background 0.2s ease;
}
.jt-row.clickable {
  cursor: pointer;
}
.jt-row.clickable:hover .jt-summary,
.jt-row.clickable:hover .jt-bracket {
  color: var(--accent);
}
.jt-row.is-current {
  background: rgba(98, 64, 232, 0.16);
  box-shadow: inset 0 0 0 1px rgba(98, 64, 232, 0.45);
}

.jt-toggle {
  display: inline-block;
  width: 12px;
  flex-shrink: 0;
  color: var(--text-dim);
  font-size: 10px;
  user-select: none;
  transition: color 0.12s;
}
.jt-toggle-spacer {
  visibility: hidden;
}
.jt-row.clickable:hover .jt-toggle {
  color: var(--accent);
}

.jt-key {
  font-weight: 500;
}
.jt-key-str {
  color: var(--tok-key);
}
.jt-key-idx {
  color: var(--text-dim);
}
.jt-colon {
  color: var(--text-dim);
  margin-right: 4px;
}

.jt-bracket {
  color: var(--text-dim);
  transition: color 0.12s;
}
.jt-summary {
  color: var(--text-dim);
  font-style: italic;
  margin: 0 4px;
  transition: color 0.12s;
}
.jt-summary-tail {
  color: var(--text-faint);
  font-size: 11px;
  margin-left: 8px;
  font-style: italic;
}

.jt-children {
  padding-left: 16px;
  border-left: 1px dashed var(--border);
  margin-left: 4px;
}

.jt-val {
  word-break: break-word;
  overflow-wrap: anywhere;
}
.jt-string {
  color: var(--tok-str);
}
.jt-number {
  color: var(--tok-num);
}
.jt-boolean {
  color: var(--tok-bool);
  font-weight: 500;
}
.jt-null,
.jt-undefined {
  color: var(--tok-null);
  font-style: italic;
}

.jt-hl {
  background: rgba(255, 213, 79, 0.55);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
  font-weight: 600;
}
:global([data-theme='dark']) .jt-hl {
  background: rgba(255, 184, 0, 0.45);
  color: #ffe9a8;
}
</style>
