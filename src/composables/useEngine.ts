import { computed, ref } from 'vue';
import type { EngineType } from '../api/execute';

const STORAGE_KEY = 'curl-display:engine';
const DEFAULT_ENGINE: EngineType = 'browser';

function isEngine(v: unknown): v is EngineType {
  return v === 'browser' || v === 'server';
}

function loadInitial(): EngineType {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (isEngine(v)) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_ENGINE;
}

const engine = ref<EngineType>(loadInitial());

export function useEngine() {
  function setEngine(next: EngineType) {
    if (!isEngine(next)) return;
    engine.value = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  return {
    engine,
    setEngine,
    isBrowser: computed(() => engine.value === 'browser'),
    isServer: computed(() => engine.value === 'server'),
  };
}
