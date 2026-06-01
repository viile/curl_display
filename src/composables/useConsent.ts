import { computed, ref } from 'vue';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

export type ConsentState = 'unknown' | 'accepted' | 'declined';

const COOKIE_NAME = 'curl-display-consent';
const COOKIE_DAYS = 365;

const consent = ref<ConsentState>(loadInitial());

function loadInitial(): ConsentState {
  const v = getCookie(COOKIE_NAME);
  if (v === 'accepted' || v === 'declined') return v;
  return 'unknown';
}

export function useConsent() {
  function accept() {
    setCookie(COOKIE_NAME, 'accepted', { days: COOKIE_DAYS });
    consent.value = 'accepted';
  }

  function decline() {
    setCookie(COOKIE_NAME, 'declined', { days: COOKIE_DAYS });
    consent.value = 'declined';
    // 拒绝后清理已存在的本地数据，避免遗留
    try {
      localStorage.removeItem('curl-display:history');
    } catch {
      /* ignore */
    }
  }

  /** 撤销之前的同意/拒绝决定，重新弹 banner */
  function reset() {
    deleteCookie(COOKIE_NAME);
    consent.value = 'unknown';
  }

  return {
    consent,
    isAccepted: computed(() => consent.value === 'accepted'),
    isDeclined: computed(() => consent.value === 'declined'),
    isUnknown: computed(() => consent.value === 'unknown'),
    accept,
    decline,
    reset,
  };
}
