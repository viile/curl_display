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
      items.value = parsed.filter(
        (i) => i && typeof i.command === 'string' && typeof i.timestamp === 'number'
      );
    }
  } catch {
    items.value = [];
  }
}

function persist() {
  if (consent.value !== 'accepted') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
  } catch {
    // 配额耗尽：减半重试
    while (items.value.length > 1) {
      items.value = items.value.slice(0, Math.floor(items.value.length / 2));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
        return;
      } catch {
        /* keep shrinking */
      }
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
   */
  function record(command: string, result: ExecuteResult | null) {
    if (consent.value !== 'accepted') return;
    if (!command.trim()) return;
    const item: HistoryItem = {
      id: safeUUID(),
      command,
      result: trimBody(result),
      timestamp: Date.now(),
    };
    items.value.unshift(item);
    if (items.value.length > MAX_ITEMS) {
      items.value = items.value.slice(0, MAX_ITEMS);
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

  function clear() {
    items.value = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
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
    record,
    remove,
    clear,
    findByCommand,
  };
}
