import { computed, ref } from 'vue';
import type { EngineType } from '../api/execute';
import { IS_TAURI } from './useRuntime';

const STORAGE_KEY = 'curl-display:engine';

function isEngine(v: unknown): v is EngineType {
  return v === 'browser' || v === 'server' || v === 'desktop';
}

/**
 * 默认引擎：
 * - 在 Tauri 桌面壳内 → 强制 desktop（直接调系统 curl，无 CORS）
 * - 在浏览器内       → browser（fetch，零依赖）
 */
function loadInitial(): EngineType {
  if (IS_TAURI) return 'desktop';
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (isEngine(v) && v !== 'desktop') return v;
  } catch {
    /* ignore */
  }
  return 'browser';
}

const engine = ref<EngineType>(loadInitial());

export function useEngine() {
  function setEngine(next: EngineType) {
    if (!isEngine(next)) return;
    // 在 Tauri 内部不允许切走 desktop
    if (IS_TAURI && next !== 'desktop') return;
    engine.value = next;
    try {
      if (next !== 'desktop') localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  return {
    engine,
    setEngine,
    isBrowser: computed(() => engine.value === 'browser'),
    isServer: computed(() => engine.value === 'server'),
    isDesktop: computed(() => engine.value === 'desktop'),
    isTauri: IS_TAURI,
  };
}
