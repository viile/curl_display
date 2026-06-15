<script setup lang="ts">
/**
 * JSON 脑图视图。
 *
 * - 水平树布局：根在左，子节点向右展开
 * - 节点圆角胶囊 + 三次贝塞尔曲线连边
 * - 颜色按深度循环
 * - 点击节点折叠/展开
 * - 鼠标滚轮缩放（以鼠标位置为锚点），按住拖拽平移
 * - 双击空白处「自适应」缩放，工具栏也提供按钮
 *
 * 故意不引入第三方脑图库以保持包体积和主题一致性。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    data: unknown;
    /** 搜索关键字；非空时高亮命中节点、自动展开命中祖先链、可与 currentMatchIndex 配合定位 */
    query?: string;
    /** 当前聚焦的命中下标（0-based），由父组件控制；-1 / undefined = 无聚焦 */
    currentMatchIndex?: number;
  }>(),
  { query: '', currentMatchIndex: -1 }
);

const emit = defineEmits<{
  /** 命中数量变化时上报，让父组件的搜索 footer "X / Y" 实时更新 */
  (e: 'update:totalMatches', n: number): void;
}>();

/* ------------------------------------------------------------------ types */
type ValueKind =
  | 'object'
  | 'array'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'undefined';

interface MNode {
  id: string;
  label: string;
  kind: ValueKind;
  isContainer: boolean;
  depth: number;
  children: MNode[];
  /** 指向父节点（root.parent = null）。用于命中搜索时回溯祖先链做强制展开 */
  parent: MNode | null;
  /** 原始 key / value，用于搜索匹配（label 经过截断，可能丢失字符） */
  rawKey: string | number | null;
  rawValue: unknown;
}

interface PositionedNode extends MNode {
  x: number; // left
  y: number; // top
  w: number;
  h: number;
}

interface Edge {
  from: PositionedNode;
  to: PositionedNode;
  color: string;
}

/* --------------------------------------------------------------- constants */
const ROW_HEIGHT = 36;
const COL_WIDTH = 200;
const NODE_HEIGHT = 26;
const NODE_PADDING_X = 12;
const CHAR_WIDTH = 7.2; // 估算 13px 等宽字体单字符宽度
const MAX_LABEL_CHARS = 38;
const MAX_NODE_WIDTH = MAX_LABEL_CHARS * CHAR_WIDTH + NODE_PADDING_X * 2;
const AUTO_COLLAPSE_DEPTH = 2; // 深度 ≥ 此值默认折叠

const DEPTH_COLORS: Array<{ bg: string; border: string; text: string }> = [
  { bg: 'var(--brand-from)', border: 'var(--brand-from)', text: '#fff' },
  { bg: 'rgba(37, 99, 235, 0.18)', border: 'var(--tok-key)', text: 'var(--text)' },
  { bg: 'rgba(14, 168, 132, 0.18)', border: 'var(--accent-2)', text: 'var(--text)' },
  { bg: 'rgba(194, 112, 10, 0.18)', border: 'var(--warn)', text: 'var(--text)' },
  { bg: 'rgba(196, 64, 122, 0.18)', border: 'var(--tok-bool)', text: 'var(--text)' },
  { bg: 'rgba(126, 87, 194, 0.18)', border: '#7e57c2', text: 'var(--text)' },
];

/* ------------------------------------------------------------------ utils */
let _id = 0;
function nextId(): string {
  return `m${++_id}`;
}

function getKind(v: unknown): ValueKind {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (Array.isArray(v)) return 'array';
  const t = typeof v;
  if (t === 'object') return 'object';
  if (t === 'string') return 'string';
  if (t === 'number') return 'number';
  if (t === 'boolean') return 'boolean';
  return 'string';
}

function previewPrimitive(v: unknown, kind: ValueKind): string {
  if (kind === 'string') {
    const s = v as string;
    return s.length > 24 ? `"${s.slice(0, 24)}…"` : `"${s}"`;
  }
  if (kind === 'null') return 'null';
  if (kind === 'undefined') return 'undefined';
  return String(v);
}

function makeLabel(
  name: string | number | null,
  data: unknown,
  kind: ValueKind,
  isRoot: boolean
): string {
  if (isRoot) {
    if (kind === 'object') return `{} root · ${Object.keys(data as object).length} keys`;
    if (kind === 'array') return `[] root · ${(data as unknown[]).length} items`;
    return `root · ${previewPrimitive(data, kind)}`;
  }
  const k = typeof name === 'number' ? `[${name}]` : name;
  if (kind === 'object') {
    const n = Object.keys(data as object).length;
    return `${k} {} ${n}`;
  }
  if (kind === 'array') {
    const n = (data as unknown[]).length;
    return `${k} [] ${n}`;
  }
  return `${k}: ${previewPrimitive(data, kind)}`;
}

function ellipsize(s: string, max = MAX_LABEL_CHARS): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + '…';
}

function estimateWidth(label: string): number {
  const shown = ellipsize(label);
  return Math.min(MAX_NODE_WIDTH, shown.length * CHAR_WIDTH + NODE_PADDING_X * 2 + 16);
}

/* --------------------------------------------------- 数据 → 节点树 (无布局) */
function buildTree(
  data: unknown,
  name: string | number | null,
  depth: number,
  isRoot: boolean,
  parent: MNode | null
): MNode {
  const kind = getKind(data);
  const node: MNode = {
    id: nextId(),
    label: makeLabel(name, data, kind, isRoot),
    kind,
    isContainer: kind === 'object' || kind === 'array',
    depth,
    children: [],
    parent,
    rawKey: name,
    rawValue: data,
  };
  if (kind === 'object') {
    for (const [k, v] of Object.entries(data as object)) {
      node.children.push(buildTree(v, k, depth + 1, false, node));
    }
  } else if (kind === 'array') {
    (data as unknown[]).forEach((v, i) => {
      node.children.push(buildTree(v, i, depth + 1, false, node));
    });
  }
  return node;
}

const rootNode = computed<MNode>(() => {
  _id = 0;
  return buildTree(props.data, null, 0, true, null);
});

/** id → MNode 反查表；pan 到目标节点、定位祖先链都要用 */
const nodeById = computed<Map<string, MNode>>(() => {
  const map = new Map<string, MNode>();
  const walk = (n: MNode) => {
    map.set(n.id, n);
    for (const c of n.children) walk(c);
  };
  walk(rootNode.value);
  return map;
});

/* --------------------------------------------------------- 折叠状态管理 */
const collapsedIds = ref<Set<string>>(new Set());

/** 数据切换 → 根据深度自动折叠太深的节点；重置历史折叠状态 */
watch(
  rootNode,
  (root) => {
    const next = new Set<string>();
    const walk = (n: MNode) => {
      if (n.isContainer && n.depth >= AUTO_COLLAPSE_DEPTH && n.children.length) {
        next.add(n.id);
      }
      for (const c of n.children) walk(c);
    };
    walk(root);
    collapsedIds.value = next;
    // 切换数据时复位视图
    nextTick(fitToView);
  },
  { immediate: true }
);

function toggleCollapse(id: string) {
  const s = new Set(collapsedIds.value);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  collapsedIds.value = s;
}

/* ------------------------------------------------------------- 搜索匹配 */
function primitiveToString(v: unknown): string {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'string') return v;
  return String(v);
}

/**
 * 命中节点 id 列表，pre-order 顺序 = 视觉自上而下顺序，方便 prev/next 顺次跳转。
 * 命中规则：
 *   - 对象 key：toString 后忽略大小写包含 query
 *   - 基本值（string / number / boolean / null）：转字符串后忽略大小写包含 query
 *   - 数组下标本身不参与匹配（避免搜 "1" 命中 1/10/11... 噪音）
 *   - 容器节点不按"值"参与匹配（label 里的 keys/items 计数对用户没意义）
 */
const matchedIds = computed<string[]>(() => {
  const q = props.query.trim().toLowerCase();
  if (!q) return [];
  const ids: string[] = [];
  const walk = (n: MNode) => {
    let matched = false;
    if (
      n.rawKey != null &&
      typeof n.rawKey !== 'number' &&
      String(n.rawKey).toLowerCase().includes(q)
    ) {
      matched = true;
    }
    if (!matched && !n.isContainer) {
      if (primitiveToString(n.rawValue).toLowerCase().includes(q)) {
        matched = true;
      }
    }
    if (matched) ids.push(n.id);
    for (const c of n.children) walk(c);
  };
  walk(rootNode.value);
  return ids;
});

const matchedIdSet = computed<Set<string>>(() => new Set(matchedIds.value));

/** 命中节点对应的当前 id（受父组件 currentMatchIndex 驱动） */
const currentMatchId = computed<string | null>(() => {
  const idx = props.currentMatchIndex;
  if (idx == null || idx < 0) return null;
  return matchedIds.value[idx] ?? null;
});

/** 命中节点的全部祖先 id 集合：搜索期间这些节点强制展开，确保命中可见 */
const forceExpandedIds = computed<Set<string>>(() => {
  const set = new Set<string>();
  const lookup = nodeById.value;
  for (const id of matchedIds.value) {
    let node = lookup.get(id)?.parent ?? null;
    while (node) {
      set.add(node.id);
      node = node.parent;
    }
  }
  return set;
});

/** 当前是否搜索态：true 时折叠状态以 forceExpandedIds 为准 */
const isSearching = computed(() => props.query.trim().length > 0);

function isEffectivelyCollapsed(id: string): boolean {
  if (isSearching.value && forceExpandedIds.value.has(id)) return false;
  return collapsedIds.value.has(id);
}

// 命中数变化时向父组件同步，由父组件维护 totalMatches / currentMatchIndex
watch(
  matchedIds,
  (arr) => {
    emit('update:totalMatches', arr.length);
  },
  { immediate: true }
);

/* ------------------------------------------------------------------ 布局 */
interface LayoutResult {
  nodes: PositionedNode[];
  edges: Edge[];
  width: number;
  height: number;
}

const layout = computed<LayoutResult>(() => {
  const root = rootNode.value;
  const flat: PositionedNode[] = [];
  const edges: Edge[] = [];

  // 第一遍：post-order 分配 y（单位 = 行）
  let leafCursor = 0;
  const layoutY = (n: MNode): { y: number } => {
    const collapsedHere = isEffectivelyCollapsed(n.id);
    if (!n.children.length || collapsedHere) {
      const y = leafCursor++;
      (n as PositionedNode).y = y;
      return { y };
    }
    const ys: number[] = [];
    for (const c of n.children) ys.push(layoutY(c).y);
    const y = (ys[0] + ys[ys.length - 1]) / 2;
    (n as PositionedNode).y = y;
    return { y };
  };
  layoutY(root);

  // 第二遍：分配 x = depth；写到 flat；构造 edges
  const visit = (n: MNode) => {
    const yUnits = (n as PositionedNode).y as number;
    const pos: PositionedNode = {
      ...n,
      x: n.depth * COL_WIDTH,
      y: yUnits * ROW_HEIGHT,
      w: estimateWidth(n.label),
      h: NODE_HEIGHT,
    } as PositionedNode;
    flat.push(pos);

    if (isEffectivelyCollapsed(n.id)) return pos;
    for (const c of n.children) {
      const cp = visit(c);
      edges.push({
        from: pos,
        to: cp,
        color: DEPTH_COLORS[Math.min(cp.depth, DEPTH_COLORS.length - 1)].border,
      });
    }
    return pos;
  };
  visit(root);

  // 计算画布尺寸（含 padding）
  const xs = flat.map((n) => n.x + n.w);
  const ys = flat.map((n) => n.y + n.h);
  const width = (xs.length ? Math.max(...xs) : 200) + 40;
  const height = (ys.length ? Math.max(...ys) : 100) + 40;
  return { nodes: flat, edges, width, height };
});

function nodeStyle(n: PositionedNode): {
  bg: string;
  border: string;
  text: string;
} {
  return DEPTH_COLORS[Math.min(n.depth, DEPTH_COLORS.length - 1)];
}

function edgePath(e: Edge): string {
  const sx = e.from.x + e.from.w;
  const sy = e.from.y + e.from.h / 2;
  const tx = e.to.x;
  const ty = e.to.y + e.to.h / 2;
  const dx = Math.max(40, (tx - sx) * 0.5);
  return `M ${sx},${sy} C ${sx + dx},${sy} ${tx - dx},${ty} ${tx},${ty}`;
}

function isCollapsed(id: string) {
  return isEffectivelyCollapsed(id);
}

function nodeHasChildren(n: PositionedNode) {
  return n.isContainer && n.children.length > 0;
}

/* ---------------------------------------------------- 平移 / 缩放交互 */
const wrap = ref<HTMLDivElement | null>(null);
const tx = ref(20);
const ty = ref(20);
const scale = ref(1);

const MIN_SCALE = 0.2;
const MAX_SCALE = 3;

function clampScale(s: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
}

function onWheel(e: WheelEvent) {
  if (!wrap.value) return;
  e.preventDefault();
  const rect = wrap.value.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;
  const delta = -e.deltaY * 0.0015;
  const nextScale = clampScale(scale.value * Math.exp(delta));
  // 让鼠标下方的世界坐标点保持不动
  const k = nextScale / scale.value;
  tx.value = px - (px - tx.value) * k;
  ty.value = py - (py - ty.value) * k;
  scale.value = nextScale;
}

let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
let tx0 = 0;
let ty0 = 0;

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return;
  dragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  tx0 = tx.value;
  ty0 = ty.value;
  if (wrap.value) wrap.value.style.cursor = 'grabbing';
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}
function onMouseMove(e: MouseEvent) {
  if (!dragging) return;
  tx.value = tx0 + (e.clientX - dragStartX);
  ty.value = ty0 + (e.clientY - dragStartY);
}
function onMouseUp() {
  dragging = false;
  if (wrap.value) wrap.value.style.cursor = '';
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
}

function fitToView() {
  if (!wrap.value) return;
  const rect = wrap.value.getBoundingClientRect();
  const { width, height } = layout.value;
  if (!width || !height || !rect.width || !rect.height) return;
  const k = clampScale(
    Math.min((rect.width - 40) / width, (rect.height - 40) / height, 1)
  );
  scale.value = k;
  tx.value = (rect.width - width * k) / 2;
  ty.value = (rect.height - height * k) / 2;
}

function reset() {
  scale.value = 1;
  tx.value = 20;
  ty.value = 20;
}

/**
 * 把指定节点平移到视口中心，scale 保持不变。
 *
 * 推导：父容器内某节点中心(world) = (node.x + node.w/2, node.y + node.h/2)
 * 经 translate(tx,ty) scale(s) 后投影到视口内坐标系为：
 *   viewportX = tx + (node.x + node.w/2) * s
 *   viewportY = ty + (node.y + node.h/2) * s
 * 想让它落到视口正中心 (rect.w/2, rect.h/2)，反解 tx / ty。
 */
function panToNode(id: string) {
  if (!wrap.value) return;
  const node = layout.value.nodes.find((n) => n.id === id);
  if (!node) return;
  const rect = wrap.value.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const s = scale.value;
  tx.value = rect.width / 2 - (node.x + node.w / 2) * s;
  ty.value = rect.height / 2 - (node.y + node.h / 2) * s;
}

// 父组件切换 currentMatchIndex 时，平滑滚到对应节点
// 等 nextTick 确保 forceExpandedIds 已驱动 layout 重算、节点已存在
watch(
  () => props.currentMatchIndex,
  () => {
    const id = currentMatchId.value;
    if (!id) return;
    nextTick(() => panToNode(id));
  }
);

onMounted(() => {
  nextTick(fitToView);
  window.addEventListener('resize', fitToView);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', fitToView);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
});

/* ---------------------------------------------------- 节点点击处理 */
function onNodeClick(n: PositionedNode, e: MouseEvent) {
  e.stopPropagation();
  if (!nodeHasChildren(n)) return;
  toggleCollapse(n.id);
}
</script>

<template>
  <div class="mm-wrap" ref="wrap" @wheel="onWheel" @mousedown="onMouseDown" @dblclick="fitToView">
    <div class="mm-toolbar">
      <button class="mm-btn" :title="'Zoom in'" @click.stop="scale = clampScale(scale * 1.2)">+</button>
      <button class="mm-btn" :title="'Zoom out'" @click.stop="scale = clampScale(scale / 1.2)">−</button>
      <button class="mm-btn" :title="'Fit'" @click.stop="fitToView">⤢</button>
      <button class="mm-btn" :title="'Reset'" @click.stop="reset">⟲</button>
      <span class="mm-scale">{{ Math.round(scale * 100) }}%</span>
    </div>

    <svg class="mm-svg" width="100%" height="100%">
      <g :transform="`translate(${tx} ${ty}) scale(${scale})`">
        <g class="mm-edges">
          <path
            v-for="(e, i) in layout.edges"
            :key="'e' + i"
            :d="edgePath(e)"
            :stroke="e.color"
            stroke-width="1.5"
            fill="none"
            opacity="0.7"
          />
        </g>
        <g class="mm-nodes">
          <g
            v-for="n in layout.nodes"
            :key="n.id"
            :transform="`translate(${n.x} ${n.y})`"
            class="mm-node"
            :class="{
              clickable: nodeHasChildren(n),
              root: n.depth === 0,
              matched: matchedIdSet.has(n.id),
              'current-match': n.id === currentMatchId,
            }"
            @mousedown.stop
            @click="onNodeClick(n, $event)"
          >
            <rect
              :width="n.w"
              :height="n.h"
              :rx="n.h / 2"
              :ry="n.h / 2"
              :fill="nodeStyle(n).bg"
              :stroke="nodeStyle(n).border"
              stroke-width="1.5"
            />
            <text
              :x="NODE_PADDING_X"
              :y="n.h / 2"
              dominant-baseline="middle"
              :fill="nodeStyle(n).text"
              class="mm-label"
            >
              {{ ellipsize(n.label) }}
            </text>
            <g v-if="nodeHasChildren(n)" :transform="`translate(${n.w - 14} ${n.h / 2})`">
              <circle r="7" fill="var(--panel)" stroke="var(--border-strong)" stroke-width="1" />
              <text
                x="0"
                y="0"
                text-anchor="middle"
                dominant-baseline="central"
                class="mm-collapse-mark"
              >
                {{ isCollapsed(n.id) ? '+' : '−' }}
              </text>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.mm-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 360px;
  background:
    radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 1px) 0 0 / 24px 24px,
    var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  touch-action: none;
}
.mm-wrap:active {
  cursor: grabbing;
}

.mm-toolbar {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 3px 6px;
  box-shadow: var(--shadow);
}
.mm-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  line-height: 1;
}
.mm-btn:hover {
  background: var(--hover);
  color: var(--accent);
}
.mm-scale {
  margin-left: 4px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-dim);
  min-width: 32px;
  text-align: right;
}

.mm-svg {
  display: block;
}
.mm-node {
  pointer-events: bounding-box;
}
.mm-node.clickable {
  cursor: pointer;
}
.mm-node:not(.clickable) {
  cursor: default;
}
.mm-node.clickable:hover rect {
  stroke-width: 2;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.18));
}

/* 搜索命中节点：金黄色描边，更醒目 */
.mm-node.matched > rect {
  stroke: #f5b94a;
  stroke-width: 2.5;
}
/* 当前聚焦的命中：再加发光晕，并改填充让对比更强 */
.mm-node.current-match > rect {
  stroke: #f5b94a;
  stroke-width: 3.5;
  fill: rgba(245, 185, 74, 0.32);
  filter: drop-shadow(0 0 8px rgba(245, 185, 74, 0.65));
}
.mm-node.matched .mm-label,
.mm-node.current-match .mm-label {
  font-weight: 700;
}

.mm-label {
  font-family: var(--mono);
  font-size: 12px;
  pointer-events: none;
}
.mm-collapse-mark {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  fill: var(--text);
  pointer-events: none;
  user-select: none;
}
</style>
