import { computed, ref, watch } from 'vue';
import type { ExecuteResult } from '../api/execute';
import { useConsent } from './useConsent';

const STORAGE_KEY = 'curl-display:history';
/** 上限：每次执行都新增一条，所以上限放宽到 100。超出时按时间倒序裁掉最旧的 */
const MAX_ITEMS = 100;
/** 单条结果 body 截断阈值，避免 localStorage 配额爆掉 */
const BODY_TRUNCATE_BYTES = 100_000;

export interface HistoryItem {
  id: string;
  command: string;
  result: ExecuteResult | null;
  timestamp: number;
  /** 收藏标记。收藏项不会被 clear all 删除，配额吃紧或 trim 时也优先保留 */
  favorite?: boolean;
}

const items = ref<HistoryItem[]>([]);
let loaded = false;

const { consent } = useConsent();

function safeUUID(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return (crypto as any).randomUUID();
    }
  } catch {
    /* ignore */
  }
  return `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function trimBody(result: ExecuteResult | null): ExecuteResult | null {
  if (!result || !result.body) return result;
  if (result.body.length <= BODY_TRUNCATE_BYTES) return result;
  return {
    ...result,
    body:
      result.body.slice(0, BODY_TRUNCATE_BYTES) +
      `\n\n... [truncated ${result.body.length - BODY_TRUNCATE_BYTES} chars]`,
  };
}

function load() {
  loaded = true;
  if (consent.value !== 'accepted') {
    items.value = [];
    return;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      items.value = [];
      return;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      items.value = parsed
        .filter((i) => i && typeof i.command === 'string' && typeof i.timestamp === 'number')
        .map((i) => ({ ...i, favorite: !!i.favorite }));
    }
  } catch {
    items.value = [];
  }
}

function persist() {
  if (consent.value !== 'accepted') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
    return;
  } catch {
    /* fall through to shrink */
  }
  // 配额耗尽：保留所有收藏，砍掉一半最旧的非收藏项，循环到能写入或只剩收藏
  while (true) {
    const nonFavs = items.value.filter((i) => !i.favorite);
    if (nonFavs.length === 0) return;
    const keepNonFav = Math.floor(nonFavs.length / 2);
    const keepIds = new Set(nonFavs.slice(0, keepNonFav).map((i) => i.id));
    items.value = items.value.filter((i) => i.favorite || keepIds.has(i.id));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
      return;
    } catch {
      /* continue shrinking */
    }
  }
}

// consent 变化时，loaded 状态联动
watch(consent, (v) => {
  if (v === 'accepted') {
    load();
  } else if (v === 'declined') {
    items.value = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
});

export function useHistory() {
  if (!loaded) load();

  /**
   * 追加一条历史。每次调用都新增一条（不去重），允许同一命令在不同时间多次出现。
   * 超过 MAX_ITEMS 时优先砍最旧的非收藏项，收藏项永远不会被自动 trim。
   */
  function record(command: string, result: ExecuteResult | null) {
    if (consent.value !== 'accepted') return;
    if (!command.trim()) return;
    const item: HistoryItem = {
      id: safeUUID(),
      command,
      result: trimBody(result),
      timestamp: Date.now(),
      favorite: false,
    };
    items.value.unshift(item);
    if (items.value.length > MAX_ITEMS) {
      const favs = items.value.filter((i) => i.favorite);
      const nonFavs = items.value.filter((i) => !i.favorite);
      const remaining = Math.max(0, MAX_ITEMS - favs.length);
      const keepIds = new Set([
        ...favs.map((i) => i.id),
        ...nonFavs.slice(0, remaining).map((i) => i.id),
      ]);
      items.value = items.value.filter((i) => keepIds.has(i.id));
    }
    persist();
  }

  function remove(id: string) {
    const idx = items.value.findIndex((i) => i.id === id);
    if (idx >= 0) {
      items.value.splice(idx, 1);
      persist();
    }
  }

  function toggleFavorite(id: string) {
    const item = items.value.find((i) => i.id === id);
    if (!item) return;
    item.favorite = !item.favorite;
    persist();
  }

  /**
   * 清空历史，但保留所有收藏项。
   * 如果连同收藏一起清，请手动逐条 remove 或直接清 localStorage。
   */
  function clear() {
    items.value = items.value.filter((i) => i.favorite);
    if (items.value.length === 0) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    } else {
      persist();
    }
  }

  function findByCommand(command: string): HistoryItem | null {
    const n = command.trim();
    if (!n) return null;
    return items.value.find((i) => i.command.trim() === n) ?? null;
  }

  return {
    items,
    count: computed(() => items.value.length),
    favoriteCount: computed(() => items.value.filter((i) => i.favorite).length),
    record,
    remove,
    toggleFavorite,
    clear,
    findByCommand,
  };
}
