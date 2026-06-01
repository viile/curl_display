import { computed, ref, watch } from 'vue';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'curl-display:theme';
const DEFAULT_MODE: ThemeMode = 'light';

const mode = ref<ThemeMode>(loadInitial());
const systemDark = ref<boolean>(detectSystemDark());

function isThemeMode(v: unknown): v is ThemeMode {
  return v === 'light' || v === 'dark' || v === 'auto';
}

function loadInitial(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isThemeMode(saved)) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_MODE;
}

function detectSystemDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

let mediaQuery: MediaQueryList | null = null;
function bindSystemListener() {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  if (mediaQuery) return;
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => {
    systemDark.value = e.matches;
  };
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
  } else {
    // Safari < 14 fallback
    (mediaQuery as MediaQueryList).addListener(handler);
  }
}
bindSystemListener();

const effective = computed<EffectiveTheme>(() => {
  if (mode.value === 'auto') return systemDark.value ? 'dark' : 'light';
  return mode.value;
});

function applyToDocument(theme: EffectiveTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
  // Element Plus 暗色模式靠 html.dark
  document.documentElement.classList.toggle('dark', theme === 'dark');
  // 让 UA 控件（滚动条/表单等）也跟随
  document.documentElement.style.colorScheme = theme;
}

watch(
  effective,
  (v) => applyToDocument(v),
  { immediate: true }
);

export function useTheme() {
  function setMode(next: ThemeMode) {
    if (!isThemeMode(next)) return;
    mode.value = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  return {
    mode,
    effective,
    systemDark,
    setMode,
    isLight: computed(() => effective.value === 'light'),
    isDark: computed(() => effective.value === 'dark'),
  };
}
