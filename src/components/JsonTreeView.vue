<script setup lang="ts">
/**
 * 递归 JSON 树。
 *
 * 用法：<JsonTreeView :data="parsedJson" />（顶层是 object/array 即可）
 * 通过文件名做自引用递归，叶子节点直接 inline 渲染基本值。
 *
 * 数据量大时，深度 > 1 的节点默认折叠，避免一次性渲染上万节点造成卡顿。
 */
import { computed, ref } from 'vue';
import JsonTreeView from './JsonTreeView.vue';

const props = withDefaults(
  defineProps<{
    data: unknown;
    /** 节点名（对象的 key 或数组下标）。根节点为 null */
    name?: string | number | null;
    /** 当前深度，根 = 0 */
    depth?: number;
    /** 是否是数组元素（影响 key 颜色） */
    asArrayItem?: boolean;
  }>(),
  {
    name: null,
    depth: 0,
    asArrayItem: false,
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

const expanded = ref(
  props.depth < AUTO_EXPAND_DEPTH ||
    (isContainer.value && childCount.value <= LARGE_CONTAINER_THRESHOLD && props.depth < 2)
);

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
</script>

<template>
  <div
    class="jt-node"
    :class="{ 'jt-root': depth === 0, 'jt-container': isContainer }"
  >
    <div class="jt-row" :class="{ clickable: isContainer }" @click="isContainer && toggle()">
      <span v-if="isContainer" class="jt-toggle" aria-hidden="true">
        {{ expanded ? '▾' : '▸' }}
      </span>
      <span v-else class="jt-toggle jt-toggle-spacer" aria-hidden="true"></span>

      <span v-if="keyDisplay" :class="['jt-key', asArrayItem ? 'jt-key-idx' : 'jt-key-str']">
        {{ keyDisplay }}<span class="jt-colon">:</span>
      </span>

      <template v-if="isContainer">
        <span class="jt-bracket">{{ kind === 'array' ? '[' : '{' }}</span>
        <span v-if="!expanded" class="jt-summary">{{ summary }}</span>
        <span v-if="!expanded" class="jt-bracket">{{ kind === 'array' ? ']' : '}' }}</span>
      </template>
      <template v-else>
        <span :class="['jt-val', `jt-${kind}`]">{{ formatPrimitive(data) }}</span>
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
}
.jt-row.clickable {
  cursor: pointer;
}
.jt-row.clickable:hover .jt-summary,
.jt-row.clickable:hover .jt-bracket {
  color: var(--accent);
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
</style>
